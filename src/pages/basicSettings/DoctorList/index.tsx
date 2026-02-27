import { DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Popconfirm, Space } from 'antd';
import React, { useRef } from 'react';
import { deleteDoctorUser, getDoctorUsers } from '@/services/doctor-admin';
import { createProTableRequest } from '@/utils/proTableRequest';
import CreateDoctorForm from './components/CreateDoctorForm';
import EditDoctorForm from './components/EditDoctorForm';
import ResetPasswordModal from './components/ResetPasswordModal';

const DoctorList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  const { run: runDelete } = useRequest(deleteDoctorUser, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => {
      message.error('删除失败，请重试');
    },
  });

  const columns: ProColumns<API.DoctorUser>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      fieldProps: {
        placeholder: '请输入医师姓名…',
      },
    },
    {
      title: '工号',
      dataIndex: 'code',
      width: 150,
      fieldProps: {
        placeholder: '请输入工号…',
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <EditDoctorForm
            trigger={
              <Button type="link" size="small" icon={<EditOutlined />}>
                编辑
              </Button>
            }
            record={record}
            onOk={() => actionRef.current?.reload()}
          />
          <ResetPasswordModal
            trigger={
              <Button type="link" size="small" icon={<LockOutlined />}>
                修改密码
              </Button>
            }
            record={record}
          />
          <Popconfirm
            title="确认删除"
            description={`确定要删除医师「${record.name}」吗？`}
            onConfirm={() => runDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.DoctorUser>
        headerTitle="医师列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <CreateDoctorForm
            key="create"
            onOk={() => actionRef.current?.reload()}
          />,
        ]}
        request={createProTableRequest(getDoctorUsers, (p) => ({
          name: p.name || undefined,
          code: p.code || undefined,
        }))}
        columns={columns}
        scroll={{ x: 700 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default DoctorList;
