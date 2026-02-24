import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteDiseaseType, getDiseaseTypes } from '@/services/disease-type';
import type { DiseaseType } from '@/services/disease-type/typings.d';
import { formatDateTime } from '@/utils/date';
import CreateDiseaseTypeForm from './components/CreateDiseaseTypeForm';
import DetailModal from './components/DetailModal';
import EditDiseaseTypeForm from './components/EditDiseaseTypeForm';

const { Paragraph } = Typography;

const DiseaseTypeList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<DiseaseType | null>(null);

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
      ellipsis: true,
    },
    {
      title: '疾病类别',
      dataIndex: 'disease_category',
      render: (_, record) => <Tag>{record.disease_category}</Tag>,
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
          <a
            onClick={() => {
              setViewingRecord(record);
              setDetailModalOpen(true);
            }}
          >
            <EyeOutlined /> 详情
          </a>
          <EditDiseaseTypeForm
            trigger={
              <a>
                <EditOutlined /> 编辑
              </a>
            }
            record={record}
            onOk={() => actionRef.current?.reload()}
          />
          <Popconfirm
            title="确认删除"
            description={`确定要删除「${record.disease_name}」吗？`}
            onConfirm={() => runDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" style={{ padding: 0 }}>
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
        request={async (params) => {
          const {
            current = 1,
            pageSize = 10,
            disease_name,
            disease_category,
          } = params;
          try {
            const { data } = await getDiseaseTypes({
              offset: (current - 1) * pageSize,
              limit: pageSize,
              disease_name: disease_name || undefined,
              disease_category: disease_category || undefined,
            });
            return { data: data.items, total: data.total, success: true };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <DetailModal
        open={detailModalOpen}
        record={viewingRecord}
        onCancel={() => setDetailModalOpen(false)}
      />
    </PageContainer>
  );
};

export default DiseaseTypeList;
