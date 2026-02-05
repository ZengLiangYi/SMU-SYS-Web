import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteDiseaseType, getDiseaseTypes } from '@/services/disease-type';
import type { DiseaseType } from '@/services/disease-type/typings.d';
import { formatDateTime } from '@/utils/date';
import CreateDiseaseTypeForm from './components/CreateDiseaseTypeForm';
import DetailModal from './components/DetailModal';
import EditDiseaseTypeForm from './components/EditDiseaseTypeForm';

const DiseaseTypeList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  // 详情弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<DiseaseType | null>(null);

  // 删除请求
  const { run: runDelete } = useRequest(deleteDiseaseType, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => {
      message.error('删除失败，请重试');
    },
  });

  // 查看详情
  const handleViewDetail = (record: DiseaseType) => {
    setViewingRecord(record);
    setDetailModalOpen(true);
  };

  // 表格列定义
  const columns: ProColumns<DiseaseType>[] = [
    {
      title: '疾病类别',
      dataIndex: 'disease_category',
      width: 120,
      fieldProps: {
        placeholder: '请输入疾病类别…',
      },
    },
    {
      title: '疾病名称',
      dataIndex: 'disease_name',
      width: 150,
      fieldProps: {
        placeholder: '请输入疾病名称…',
      },
    },
    {
      title: '疾病表现',
      dataIndex: 'manifestations',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '康复处方建议',
      dataIndex: 'rehab_recommendation',
      width: 250,
      ellipsis: true,
      search: false,
    },
    {
      title: '登记医师',
      dataIndex: 'created_by_doctor_name',
      width: 100,
      search: false,
      render: (_, record) => record.created_by_doctor_name ?? '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      search: false,
      render: (_, record) => formatDateTime(record.created_at),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            aria-label="详情"
          >
            详情
          </Button>
          <EditDiseaseTypeForm
            trigger={
              <Button type="link" size="small" icon={<EditOutlined />}>
                编辑
              </Button>
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
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              aria-label="删除"
            >
              删除
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
            disease_category,
            disease_name,
          } = params;
          try {
            const { data } = await getDiseaseTypes({
              offset: (current - 1) * pageSize,
              limit: pageSize,
              disease_category: disease_category || undefined,
              disease_name: disease_name || undefined,
            });
            return {
              data: data.items,
              total: data.total,
              success: true,
            };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />

      {/* 详情弹窗 */}
      <DetailModal
        open={detailModalOpen}
        record={viewingRecord}
        onCancel={() => setDetailModalOpen(false)}
      />
    </PageContainer>
  );
};

export default DiseaseTypeList;
