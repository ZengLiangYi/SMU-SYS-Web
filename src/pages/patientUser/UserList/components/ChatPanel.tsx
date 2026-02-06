import { UserOutlined } from '@ant-design/icons';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import { useModel, useRequest } from '@umijs/max';
import { App, Avatar, Badge, Empty, Image, Spin } from 'antd';
import { createStyles } from 'antd-style';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  getConversations,
  getMessages,
  markConversationRead,
  recallMessage,
  sendMessage,
} from '@/services/chat';
import type {
  ConversationListItem,
  MessageListItem,
} from '@/services/chat/typings.d';
import { getPatients } from '@/services/patient-user';
import { getStaticUrl } from '@/services/static';
import { useSocket } from '@/services/websocket/useSocket';

const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    height: 580,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadius,
    overflow: 'hidden',
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
    overflowY: 'auto',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  bubbleContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  senderArea: {
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    padding: 12,
  },
  emptyChat: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timestamp: {
    fontSize: 11,
    color: token.colorTextQuaternary,
    fontVariantNumeric: 'tabular-nums',
  },
}));

const ChatPanel: React.FC = () => {
  const { styles } = useStyles();
  const { message: antMessage } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDoctorId = initialState?.currentUser?.id;

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageListItem[]>([]);
  const [sending, setSending] = useState(false);
  const bubbleListRef = useRef<any>(null);

  // -------- 患者名称映射 --------
  const { data: patientData } = useRequest(() => getPatients({ limit: 200 }), {
    cacheKey: 'patient-name-map',
  });
  const patientNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (patientData?.items) {
      for (const p of patientData.items) {
        map.set(p.id, p.name);
      }
    }
    return map;
  }, [patientData]);

  // -------- 会话列表 --------
  const {
    data: convData,
    loading: convLoading,
    refresh: refreshConversations,
  } = useRequest(() => getConversations({ limit: 100 }));
  const conversations: ConversationListItem[] = convData?.items ?? [];

  // -------- 消息列表 --------
  const { run: fetchMessages, loading: msgsLoading } = useRequest(
    (convId: string) => getMessages(convId, { limit: 100 }),
    {
      manual: true,
      onSuccess: (data) => {
        // 倒序：API 返回最新在前，Bubble.List 需要最旧在前
        setMessages([...(data?.items ?? [])].reverse());
      },
    },
  );

  // -------- 切换会话 --------
  const handleConversationChange = useCallback(
    (key: string) => {
      setActiveConvId(key);
      setMessages([]);
      fetchMessages(key);
      // 标记已读（fire and forget）
      markConversationRead(key).catch(() => {});
    },
    [fetchMessages],
  );

  // -------- 发送消息 --------
  const handleSend = useCallback(
    async (content: string) => {
      if (!activeConvId || !content.trim()) return;
      setSending(true);
      try {
        const { data } = await sendMessage(activeConvId, {
          msg_type: 'text',
          content: content.trim(),
        });
        // 追加到消息列表（functional setState 避免闭包问题）
        setMessages((prev) => [...prev, data]);
      } catch {
        antMessage.error('发送失败，请重试');
      } finally {
        setSending(false);
      }
    },
    [activeConvId, antMessage],
  );

  // -------- 撤回消息 --------
  const _handleRecall = useCallback(
    async (messageId: string) => {
      try {
        await recallMessage(messageId);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  status: 'recalled' as const,
                  recalled_at: new Date().toISOString(),
                }
              : m,
          ),
        );
      } catch {
        antMessage.error('撤回失败');
      }
    },
    [antMessage],
  );

  // -------- WebSocket 实时消息 --------
  useSocket('message:new', (payload) => {
    const { conversation_id, message: newMsg } = payload.data;
    if (conversation_id === activeConvId) {
      setMessages((prev) => [...prev, newMsg]);
    }
    // 刷新会话列表（更新排序和未读数）
    refreshConversations();
  });

  // -------- 会话列表数据映射 --------
  const conversationItems = useMemo(
    () =>
      conversations.map((conv) => ({
        key: conv.id,
        label: patientNameMap.get(conv.patient_id) ?? conv.patient_id,
        icon:
          conv.unread_count > 0 ? (
            <Badge count={conv.unread_count} size="small">
              <UserOutlined />
            </Badge>
          ) : (
            <UserOutlined />
          ),
      })),
    [conversations, patientNameMap],
  );

  // -------- 气泡数据映射 --------
  const bubbleItems = useMemo(
    () =>
      messages.map((msg) => {
        if (msg.status === 'recalled') {
          return {
            key: msg.id,
            role: 'system' as const,
            content: '消息已撤回',
          };
        }

        const isDoctor = msg.sender_role === 'doctor';
        const isOwnMessage = msg.sender_id === currentDoctorId;

        // 媒体内容渲染
        let content: React.ReactNode = msg.content ?? '';
        if (msg.msg_type === 'image' && msg.media_url) {
          content = (
            <Image
              src={getStaticUrl(msg.media_url)}
              width={200}
              style={{ borderRadius: 8 }}
            />
          );
        } else if (msg.msg_type === 'audio' && msg.media_url) {
          content = (
            // biome-ignore lint/a11y/useMediaCaption: chat messages don't have captions
            <audio src={getStaticUrl(msg.media_url)} controls />
          );
        } else if (msg.msg_type === 'video' && msg.media_url) {
          content = (
            // biome-ignore lint/a11y/useMediaCaption: chat messages don't have captions
            <video
              src={getStaticUrl(msg.media_url)}
              controls
              width={280}
              style={{ borderRadius: 8 }}
            />
          );
        }

        return {
          key: msg.id,
          role: isDoctor ? ('doctor' as const) : ('patient' as const),
          content,
          extraInfo: {
            created_at: msg.created_at,
            isOwnMessage,
            messageId: msg.id,
          },
        };
      }),
    [messages, currentDoctorId],
  );

  // -------- 角色配置 --------
  const roles = useMemo(
    () => ({
      doctor: {
        placement: 'end' as const,
        variant: 'filled' as const,
        avatar: (
          <Avatar icon={<UserOutlined />} style={{ background: '#1677ff' }} />
        ),
        footer: () => null,
      },
      patient: {
        placement: 'start' as const,
        variant: 'outlined' as const,
        avatar: <Avatar icon={<UserOutlined />} />,
        footer: () => null,
      },
    }),
    [],
  );

  return (
    <div className={styles.container}>
      {/* 左侧会话列表 */}
      <div className={styles.sidebar}>
        {convLoading ? (
          <Spin
            style={{ display: 'block', padding: 40, textAlign: 'center' }}
          />
        ) : conversations.length === 0 ? (
          <Empty
            description="暂无会话"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ marginTop: 80 }}
          />
        ) : (
          <Conversations
            activeKey={activeConvId ?? undefined}
            onActiveChange={handleConversationChange}
            items={conversationItems}
          />
        )}
      </div>

      {/* 右侧聊天区域 */}
      <div className={styles.chatArea}>
        {activeConvId ? (
          <>
            <div className={styles.bubbleContainer}>
              {msgsLoading ? (
                <Spin
                  style={{
                    display: 'block',
                    padding: 40,
                    textAlign: 'center',
                    margin: 'auto',
                  }}
                />
              ) : (
                <Bubble.List
                  ref={bubbleListRef}
                  autoScroll
                  role={roles}
                  items={bubbleItems}
                  style={{ flex: 1 }}
                />
              )}
            </div>
            <div className={styles.senderArea}>
              <Sender
                placeholder="输入消息…"
                submitType="shiftEnter"
                loading={sending}
                onSubmit={handleSend}
              />
            </div>
          </>
        ) : (
          <div className={styles.emptyChat}>
            <Empty
              description="请从左侧选择一个会话"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
