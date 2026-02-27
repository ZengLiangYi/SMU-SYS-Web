import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  App,
  Card,
  Flex,
  Image,
  List,
  Popconfirm,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { deleteMedicine, getMedicines } from '@/services/medicine';
import type { Medicine } from '@/services/medicine/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';
import { createProTableRequest } from '@/utils/proTableRequest';
import CreateMedicineForm from './components/CreateMedicineForm';
import DetailModal from './components/DetailModal';
import EditMedicineForm from './components/EditMedicineForm';

const { Link, Paragraph, Text } = Typography;

const DrugList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    record: Medicine | null;
  }>({
    open: false,
    record: null,
  });

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
        pagination={{ pageSize: 12 }}
        grid={{ gutter: [16, 16], column: 4 }}
        request={createProTableRequest(getMedicines, (p) => ({
          name: p.name || undefined,
          treatment_type: p.treatment_type || undefined,
        }))}
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
                  onClick={() => setDetailModal({ open: true, record: item })}
                >
                  <EyeOutlined /> 详情
                </Link>,
                <EditMedicineForm
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
                  description={`确定要删除药物「${item.name}」吗？`}
                  onConfirm={() => runDelete(item.id)}
                >
                  <Link type="danger">
                    <DeleteOutlined /> 删除
                  </Link>
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
        open={detailModal.open}
        record={detailModal.record}
        onCancel={() => setDetailModal((s) => ({ ...s, open: false }))}
      />
    </PageContainer>
  );
};

export default DrugList;
