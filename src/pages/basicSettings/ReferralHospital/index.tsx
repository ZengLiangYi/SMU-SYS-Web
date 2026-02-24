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
  const actionRef = useRef<ActionType>();

  const { run: runDelete } = useRequest(deleteReferral, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => message.error('删除失败，请重试'),
  });

  const columns: ProColumns<Referral>[] = [
    {
      title: '医院名称',
      dataIndex: 'hospital_name',
      ellipsis: true,
    },
    {
      title: '医院地址',
      dataIndex: 'hospital_address',
      search: false,
      ellipsis: true,
    },
    {
      title: '医院电话',
      dataIndex: 'hospital_phone',
      search: false,
      width: 140,
    },
    {
      title: '对接医师',
      dataIndex: 'doctor_name',
    },
    {
      title: '职称',
      dataIndex: 'title',
      search: false,
      width: 100,
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      search: false,
      width: 140,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: (_, record) => (
        <Space>
          <EditReferralForm
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
            description={`确定要删除「${record.hospital_name}」的转诊医生吗？`}
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
            return { data: data.items, total: data.total, success: true };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </PageContainer>
  );
};

export default ReferralHospital;
