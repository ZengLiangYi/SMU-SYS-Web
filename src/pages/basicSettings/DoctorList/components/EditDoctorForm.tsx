import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateDoctorUser } from '@/services/doctor-admin';

interface EditDoctorFormProps {
  trigger?: React.ReactElement<{ onClick?: () => void }>;
  record: API.DoctorUser;
  onOk?: () => void;
}

const EditDoctorForm: React.FC<EditDoctorFormProps> = ({
  trigger,
  record,
  onOk,
}) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);

  const { run, loading } = useRequest(
    (values: { code: string; name: string; phone?: string }) =>
      updateDoctorUser(record.id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('更新成功');
        onOk?.();
      },
      onError: () => {
        message.error('更新失败，请重试');
      },
    },
  );

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      {trigger ? cloneElement(trigger, { onClick: onOpen }) : null}
      <ModalForm
        title="编辑医师"
        open={open}
        onOpenChange={setOpen}
        initialValues={record}
        width={400}
        modalProps={{
          destroyOnClose: true,
          okButtonProps: { loading },
        }}
        onFinish={async (values: {
          code: string;
          name: string;
          phone?: string;
        }) => {
          await run(values);
          onCancel();
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
        <ProFormText
          name="phone"
          label="手机号"
          placeholder="请输入手机号…"
          fieldProps={{ inputMode: 'tel' }}
          rules={[{ max: 20, message: '手机号最多20个字符' }]}
        />
      </ModalForm>
    </>
  );
};

export default EditDoctorForm;
