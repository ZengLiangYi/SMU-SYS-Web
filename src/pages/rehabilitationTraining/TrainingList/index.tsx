import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  App,
  Card,
  Image,
  List,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { deleteRehabLevel, getRehabLevels } from '@/services/rehab-level';
import type { RehabLevel } from '@/services/rehab-level/typings.d';
import { getStaticUrl } from '@/services/static';
import { REHAB_LEVEL_TYPE_ENUM } from '@/utils/constants';
import { formatDateTime } from '@/utils/date';
import CreateTrainingForm from './components/CreateTrainingForm';
import DetailModal from './components/DetailModal';
import EditTrainingForm from './components/EditTrainingForm';

const { Link, Paragraph, Text } = Typography;

const TrainingList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<RehabLevel | null>(null);

  const { run: runDelete } = useRequest(deleteRehabLevel, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => message.error('删除失败，请重试'),
  });

  return (
    <PageContainer>
      <ProList<RehabLevel>
        headerTitle="康复训练关卡列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 12 }}
        grid={{ gutter: [16, 16], column: 4 }}
        request={async (params) => {
          const { current = 1, pageSize = 12, name, level_type } = params;
          try {
            const { data } = await getRehabLevels({
              offset: (current - 1) * pageSize,
              limit: pageSize,
              name: name || undefined,
              level_type: level_type || undefined,
            });
            return { data: data.items, total: data.total, success: true };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        metas={{
          name: { dataIndex: 'name', title: '关卡名称' },
          level_type: {
            dataIndex: 'level_type',
            title: '关卡类型',
            valueType: 'select',
            valueEnum: REHAB_LEVEL_TYPE_ENUM,
          },
        }}
        toolBarRender={() => [
          <CreateTrainingForm
            key="create"
            onOk={() => actionRef.current?.reload()}
          />,
        ]}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <Image
                  src={getStaticUrl(item.image_url)}
                  alt={item.name}
                  preview={false}
                  style={{ height: 180, objectFit: 'cover', width: '100%' }}
                />
              }
              actions={[
                <Link
                  key="detail"
                  onClick={() => {
                    setViewingRecord(item);
                    setDetailModalVisible(true);
                  }}
                >
                  <EyeOutlined /> 详情
                </Link>,
                <EditTrainingForm
                  key="edit"
                  trigger={
                    <Link>
                      <EditOutlined /> 编辑
                    </Link>
                  }
                  record={item}
                  onOk={() => actionRef.current?.reload()}
                />,
                <Popconfirm
                  key="delete"
                  title="确认删除"
                  description={`确定要删除关卡「${item.name}」吗？`}
                  onConfirm={() => runDelete(item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Link type="danger">
                    <DeleteOutlined /> 删除
                  </Link>
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={item.name}
                description={
                  <>
                    <Space size={4} style={{ marginBlockEnd: 8 }}>
                      <Tag>
                        {REHAB_LEVEL_TYPE_ENUM[item.level_type]?.text ??
                          item.level_type}
                      </Tag>
                      <Tag color="blue">Lv {item.level_range}</Tag>
                    </Space>
                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 2 }}
                      style={{ marginBottom: 8, minHeight: 44 }}
                    >
                      {item.description || '-'}
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatDateTime(item.created_at)}
                    </Text>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <DetailModal
        open={detailModalVisible}
        record={viewingRecord}
        onCancel={() => setDetailModalVisible(false)}
      />
    </PageContainer>
  );
};

export default TrainingList;
