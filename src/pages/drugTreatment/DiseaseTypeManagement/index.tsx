import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteDiseaseType, getDiseaseTypes } from '@/services/disease-type';
import type { DiseaseType } from '@/services/disease-type/typings.d';
import { formatDateTime } from '@/utils/date';
import { createProTableRequest } from '@/utils/proTableRequest';
import CreateDiseaseTypeForm from './components/CreateDiseaseTypeForm';
import DetailModal from './components/DetailModal';
import EditDiseaseTypeForm from './components/EditDiseaseTypeForm';

const { Link, Paragraph } = Typography;

const DiseaseTypeList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    record: DiseaseType | null;
  }>({
    open: false,
    record: null,
  });

  const { run: runDelete } = useRequest(deleteDiseaseType, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => message.error('删除失败，请重试'),
  });

  const columns: ProColumns<DiseaseType>[] = [
    {
      title: '疾病名称',
      dataIndex: 'disease_name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '疾病类别',
      dataIndex: 'disease_category',
      width: 120,
      render: (_, record) => (
        <Tag
          style={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {record.disease_category}
        </Tag>
      ),
    },
    {
      title: '临床表现',
      dataIndex: 'manifestations',
      search: false,
      width: 300,
      render: (_, record) => (
        <Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          style={{ marginBottom: 0 }}
        >
          {record.manifestations || '-'}
        </Paragraph>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'created_by_doctor_name',
      search: false,
      width: 100,
      render: (_, record) => record.created_by_doctor_name ?? '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      search: false,
      width: 170,
      render: (_, record) => formatDateTime(record.created_at),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <Space>
          <Link onClick={() => setDetailModal({ open: true, record })}>
            <EyeOutlined /> 详情
          </Link>
          <EditDiseaseTypeForm
            trigger={
              <Link>
                <EditOutlined /> 编辑
              </Link>
            }
            record={record}
            onOk={() => actionRef.current?.reload()}
          />
          <Popconfirm
            title="确认删除"
            description={`确定要删除「${record.disease_name}」吗？`}
            onConfirm={() => runDelete(record.id)}
          >
            <Button
              type="link"
              danger
              size="small"
              style={{ padding: 0 }}
              aria-label="删除"
            >
              <DeleteOutlined /> 删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<DiseaseType>
        headerTitle="认知疾病类型管理"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <CreateDiseaseTypeForm
            key="create"
            onOk={() => actionRef.current?.reload()}
          />,
        ]}
        request={createProTableRequest(getDiseaseTypes, (p) => ({
          disease_name: p.disease_name || undefined,
          disease_category: p.disease_category || undefined,
        }))}
        columns={columns}
        scroll={{ x: 1090 }}
        pagination={{ pageSize: 10 }}
      />

      <DetailModal
        open={detailModal.open}
        record={detailModal.record}
        onCancel={() => setDetailModal((s) => ({ ...s, open: false }))}
      />
    </PageContainer>
  );
};

export default DiseaseTypeList;
