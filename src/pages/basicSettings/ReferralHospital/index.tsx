import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Popconfirm, Space } from 'antd';
import React, { useRef } from 'react';
import { deleteReferral, getReferrals } from '@/services/referral';
import type { Referral } from '@/services/referral/typings.d';
import CreateReferralForm from './components/CreateReferralForm';
import EditReferralForm from './components/EditReferralForm';

const ReferralHospital: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  // 删除请求
  const { run: runDelete } = useRequest(deleteReferral, {
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
  const columns: ProColumns<Referral>[] = [
    {
      title: '医院名称',
      dataIndex: 'hospital_name',
      width: 150,
      fieldProps: {
        placeholder: '请输入医院名称…',
      },
    },
    {
      title: '医院地址',
      dataIndex: 'hospital_address',
      width: 200,
      search: false,
      ellipsis: true,
    },
    {
      title: '医院电话',
      dataIndex: 'hospital_phone',
      width: 140,
      search: false,
    },
    {
      title: '对接医师姓名',
      dataIndex: 'doctor_name',
      width: 120,
      fieldProps: {
        placeholder: '请输入医师姓名…',
      },
    },
    {
      title: '职位',
      dataIndex: 'title',
      width: 100,
      search: false,
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      width: 140,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <EditReferralForm
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
            description={`确定要删除「${record.hospital_name}」的转诊医生吗？`}
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
      <ProTable<Referral>
        headerTitle="转诊医院列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <CreateReferralForm
            key="create"
            onOk={() => actionRef.current?.reload()}
          />,
        ]}
        request={async (params) => {
          const {
            current = 1,
            pageSize = 10,
            hospital_name,
            doctor_name,
          } = params;
          try {
            const { data } = await getReferrals({
              offset: (current - 1) * pageSize,
              limit: pageSize,
              hospital_name: hospital_name || undefined,
              doctor_name: doctor_name || undefined,
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
        scroll={{ x: 1100 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default ReferralHospital;
