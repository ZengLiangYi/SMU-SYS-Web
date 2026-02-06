import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Image, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteMedicine, getMedicines } from '@/services/medicine';
import type { Medicine } from '@/services/medicine/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';
import CreateMedicineForm from './components/CreateMedicineForm';
import DetailModal from './components/DetailModal';
import EditMedicineForm from './components/EditMedicineForm';

const DrugList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  // 详情弹窗状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<Medicine | null>(null);

  // 删除请求
  const { run: runDelete } = useRequest(deleteMedicine, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => {
      message.error('删除失败，请重试');
    },
  });

  // 表格列定义
  const columns: ProColumns<Medicine>[] = [
    {
      title: '药物类型',
      dataIndex: 'treatment_type',
      width: 120,
      fieldProps: {
        placeholder: '请输入药物类型…',
      },
    },
    {
      title: '药物名称',
      dataIndex: 'name',
      width: 150,
      fieldProps: {
        placeholder: '请输入药物名称…',
      },
    },
    {
      title: '药物图片',
      dataIndex: 'image_url',
      width: 100,
      search: false,
      render: (_, record) => (
        <Image
          src={getStaticUrl(record.image_url)}
          alt={record.name}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '适应症',
      dataIndex: 'indications',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '药物功效',
      dataIndex: 'efficacy',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '药物用法',
      dataIndex: 'usage',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '用药禁忌',
      dataIndex: 'contraindications',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '登记医师',
      dataIndex: 'creator_name',
      width: 100,
      search: false,
      render: (_, record) => record.creator_name ?? '-',
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
          >
            详情
          </Button>
          <EditMedicineForm
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
            description={`确定要删除药物「${record.name}」吗？`}
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

  // 查看详情
  const handleViewDetail = (record: Medicine) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  return (
    <PageContainer>
      <ProTable<Medicine>
        headerTitle="药物列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <CreateMedicineForm
            key="create"
            onOk={() => actionRef.current?.reload()}
          />,
        ]}
        request={async (params) => {
          const { current = 1, pageSize = 10, treatment_type, name } = params;
          try {
            const { data } = await getMedicines({
              offset: (current - 1) * pageSize,
              limit: pageSize,
              treatment_type: treatment_type || undefined,
              name: name || undefined,
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
        scroll={{ x: 1500 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />

      {/* 详情弹窗 */}
      <DetailModal
        open={detailModalVisible}
        record={viewingRecord}
        onCancel={() => setDetailModalVisible(false)}
      />
    </PageContainer>
  );
};

export default DrugList;
