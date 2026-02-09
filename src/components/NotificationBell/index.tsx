import { BellOutlined } from '@ant-design/icons';
import { history, useModel, useRequest } from '@umijs/max';
import {
  App,
  Badge,
  Button,
  Empty,
  List,
  Popover,
  Tabs,
  Typography,
} from 'antd';
import React, { useCallback, useState } from 'react';
import {
  getNotifications,
  markNotificationsRead,
} from '@/services/notification';
import type { NotificationItem } from '@/services/notification/typings.d';
import { useSocket } from '@/services/websocket/useSocket';
import { NOTIFICATION_BIZ_ROUTE_MAP } from '@/utils/constants';
import { formatTimeAgoUTC } from '@/utils/date';

const { Text, Paragraph } = Typography;

const POLLING_INTERVAL = 60_000; // 60s（WebSocket 作为主推送通道后降低轮询频率）
const LIST_PAGE_SIZE = 20;

const NotificationBell: React.FC = () => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');

  const isDoctor =
    !!initialState?.currentUser && initialState.currentUser.role === 'doctor';

  // -------- 轮询未读总数（非医生时不启动） --------
  const { data: unreadData, refresh: refreshUnreadCount } = useRequest(
    () => getNotifications({ status: 'unread', limit: 1 }),
    {
      pollingInterval: POLLING_INTERVAL,
      pollingWhenHidden: false,
      ready: isDoctor,
    },
  );
  const unreadCount = unreadData?.total ?? 0;

  // -------- 列表数据 --------
  const {
    data: listData,
    loading: listLoading,
    run: fetchList,
  } = useRequest(
    (status: 'unread' | 'read') =>
      getNotifications({ status, limit: LIST_PAGE_SIZE }),
    {
      manual: true,
    },
  );
  const listItems: NotificationItem[] = listData?.items ?? [];

  // -------- WebSocket 实时推送 --------
  useSocket('notification:new', (_payload) => {
    refreshUnreadCount();
    if (open && activeTab === 'unread') {
      fetchList('unread');
    }
  });

  // -------- 标记已读 --------
  const { run: runMarkRead, loading: markReadLoading } = useRequest(
    markNotificationsRead,
    {
      manual: true,
      onSuccess: () => {
        refreshUnreadCount();
        fetchList(activeTab);
      },
    },
  );

  // -------- 打开 / 关闭 Popover --------
  const handleOpenChange = useCallback(
    (visible: boolean) => {
      setOpen(visible);
      if (visible) {
        fetchList(activeTab);
      }
    },
    [activeTab, fetchList],
  );

  // -------- Tab 切换 --------
  const handleTabChange = useCallback(
    (key: string) => {
      const tab = key as 'unread' | 'read';
      setActiveTab(tab);
      fetchList(tab);
    },
    [fetchList],
  );

  // -------- 单条点击 --------
  const handleItemClick = useCallback(
    (item: NotificationItem) => {
      if (item.status === 'unread') {
        runMarkRead({ ids: [item.id] });
      }

      if (item.biz_type && item.biz_id) {
        const routeFn = NOTIFICATION_BIZ_ROUTE_MAP[item.biz_type];
        if (routeFn) {
          setOpen(false);
          history.push(routeFn(item.biz_id, item.extra));
        }
      }
    },
    [runMarkRead],
  );

  // -------- 全部已读 --------
  const handleReadAll = useCallback(async () => {
    try {
      await runMarkRead({ read_all: true });
      message.success('已全部标记为已读');
    } catch {
      // onError 由 useRequest 全局处理，此处仅阻止 success 提示
    }
  }, [runMarkRead, message]);

  // 非医生角色不渲染（hooks 已全部在上方调用，符合 Rules of Hooks）
  if (!isDoctor) {
    return null;
  }

  // -------- 列表渲染 --------
  const renderList = () => (
    <div style={{ maxHeight: 340, overflowY: 'auto' }}>
      <List
        loading={listLoading || markReadLoading}
        dataSource={listItems}
        locale={{
          emptyText: (
            <Empty
              description="暂无通知"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleItemClick(item)}
            style={{ padding: '12px 16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              {item.status === 'unread' && <Badge status="processing" />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <Text strong ellipsis style={{ flex: 1 }}>
                    {item.title}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, flexShrink: 0, marginLeft: 8 }}
                  >
                    {formatTimeAgoUTC(item.created_at)}
                  </Text>
                </div>
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ marginBottom: 0, fontSize: 13 }}
                >
                  {item.content}
                </Paragraph>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  // -------- Popover 内容 --------
  const popoverContent = (
    <div style={{ width: 336 }}>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        centered
        items={[
          {
            key: 'unread',
            label: `未读${unreadCount > 0 ? ` (${unreadCount})` : ''}`,
            children: renderList(),
          },
          {
            key: 'read',
            label: '已读',
            children: renderList(),
          },
        ]}
      />
      {activeTab === 'unread' && unreadCount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '8px 0 4px',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Button type="link" size="small" onClick={handleReadAll}>
            全部已读
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
      arrow={false}
    >
      <span
        style={{
          display: 'inline-flex',
          padding: 4,
          fontSize: 18,
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        <Badge count={unreadCount} size="small" offset={[2, -2]}>
          <BellOutlined />
        </Badge>
      </span>
    </Popover>
  );
};

export default NotificationBell;
