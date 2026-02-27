import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Popconfirm, Space, Typography } from 'antd';
import React, { useRef } from 'react';
import { deleteReferral, getReferrals } from '@/services/referral';
import type { Referral } from '@/services/referral/typings.d';
import { createProTableRequest } from '@/utils/proTableRequest';
import CreateReferralForm from './components/CreateReferralForm';
import EditReferralForm from './components/EditReferralForm';

const ReferralHospital: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

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
      width: 180,
      ellipsis: true,
    },
    {
      title: '医院地址',
      dataIndex: 'hospital_address',
      search: false,
      width: 220,
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
      width: 120,
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
              <Typography.Link>
                <EditOutlined /> 编辑
              </Typography.Link>
            }
            record={record}
            onOk={() => actionRef.current?.reload()}
          />
          <Popconfirm
            title="确认删除"
            description={`确定要删除「${record.hospital_name}」的转诊医生吗？`}
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
        request={createProTableRequest(getReferrals, (p) => ({
          hospital_name: p.hospital_name || undefined,
          doctor_name: p.doctor_name || undefined,
        }))}
        columns={columns}
        scroll={{ x: 1060 }}
        pagination={{ pageSize: 10 }}
      />
    </PageContainer>
  );
};

export default ReferralHospital;
