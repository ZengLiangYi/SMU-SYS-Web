import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Card, Flex, List, Popconfirm, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteMedicine, getMedicines } from '@/services/medicine';
import type { Medicine } from '@/services/medicine/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';
import CreateMedicineForm from './components/CreateMedicineForm';
import DetailModal from './components/DetailModal';
import EditMedicineForm from './components/EditMedicineForm';

const { Paragraph, Text } = Typography;

const DrugList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<Medicine | null>(null);

  const { run: runDelete } = useRequest(deleteMedicine, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => message.error('删除失败，请重试'),
  });

  return (
    <PageContainer>
      <ProList<Medicine>
        headerTitle="药物列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 9 }}
        grid={{ gutter: [16, 16], column: 3 }}
        request={async (params) => {
          const { current = 1, pageSize = 9, name, treatment_type } = params;
          try {
            const { data } = await getMedicines({
              offset: (current - 1) * pageSize,
              limit: pageSize,
              name: name || undefined,
              treatment_type: treatment_type || undefined,
            });
            return { data: data.items, total: data.total, success: true };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        metas={{
          name: { dataIndex: 'name', title: '药物名称' },
          treatment_type: { dataIndex: 'treatment_type', title: '药物类型' },
        }}
        toolBarRender={() => [
          <CreateMedicineForm
            key="create"
            onOk={() => actionRef.current?.reload()}
          />,
        ]}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  src={getStaticUrl(item.image_url)}
                  alt={item.name}
                  style={{ height: 180, objectFit: 'cover' }}
                />
              }
              actions={[
                <a
                  key="detail"
                  onClick={() => {
                    setViewingRecord(item);
                    setDetailModalVisible(true);
                  }}
                >
                  <EyeOutlined /> 详情
                </a>,
                <EditMedicineForm
                  key="edit"
                  trigger={
                    <a>
                      <EditOutlined /> 编辑
                    </a>
                  }
                  record={item}
                  onOk={() => actionRef.current?.reload()}
                />,
                <Popconfirm
                  key="delete"
                  title="确认删除"
                  description={`确定要删除药物「${item.name}」吗？`}
                  onConfirm={() => runDelete(item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a style={{ color: 'var(--ant-color-error)' }}>
                    <DeleteOutlined /> 删除
                  </a>
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={
                  <Flex justify="space-between" align="center">
                    <Text ellipsis style={{ flex: 1 }}>
                      {item.name}
                    </Text>
                    <Tag style={{ flexShrink: 0, marginInlineEnd: 0 }}>
                      {item.treatment_type}
                    </Tag>
                  </Flex>
                }
                description={
                  <>
                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 2 }}
                      style={{ marginBottom: 8, minHeight: 44 }}
                    >
                      {item.indications || '-'}
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.creator_name ?? '-'} ·{' '}
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

export default DrugList;
