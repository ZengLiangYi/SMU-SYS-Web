import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button } from 'antd';
import type { FC } from 'react';
import { createDoctorUser } from '@/services/doctor-admin';

interface CreateDoctorFormProps {
  onOk?: () => void;
}

const CreateDoctorForm: FC<CreateDoctorFormProps> = ({ onOk }) => {
  const { message } = App.useApp();

  const { run, loading } = useRequest(createDoctorUser, {
    manual: true,
    onSuccess: () => {
      message.success('创建成功');
      onOk?.();
    },
    onError: () => {
      message.error('创建失败，请重试');
    },
  });

  return (
    <ModalForm
      title="添加医师"
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          添加医师
        </Button>
      }
      width={400}
      modalProps={{ okButtonProps: { loading } }}
      onFinish={async (values: { code: string; name: string }) => {
        await run(values);
        return true;
      }}
    >
      <ProFormText
        name="code"
        label="工号"
        placeholder="请输入工号…"
        rules={[
          { required: true, message: '请输入工号' },
          { max: 32, message: '工号最多32个字符' },
        ]}
      />
      <ProFormText
        name="name"
        label="姓名"
        placeholder="请输入姓名…"
        rules={[
          { required: true, message: '请输入姓名' },
          { max: 128, message: '姓名最多128个字符' },
        ]}
      />
    </ModalForm>
  );
};

export default CreateDoctorForm;
