import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateDoctorUser } from '@/services/doctor-admin';

interface ResetPasswordModalProps {
  trigger?: React.ReactElement<{ onClick?: () => void }>;
  record: API.DoctorUser;
  onOk?: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  trigger,
  record,
  onOk,
}) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);

  const { run, loading } = useRequest(
    (values: { password: string }) =>
      updateDoctorUser(record.id, { password: values.password }),
    {
      manual: true,
      onSuccess: () => {
        message.success('密码修改成功');
        onOk?.();
      },
      onError: () => {
        message.error('密码修改失败，请重试');
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
        title={`修改密码 - ${record.name}`}
        open={open}
        onOpenChange={setOpen}
        width={400}
        modalProps={{
          destroyOnClose: true,
          okButtonProps: { loading },
        }}
        onFinish={async (values: { password: string }) => {
          await run(values);
          onCancel();
          return true;
        }}
      >
        <ProFormText.Password
          name="password"
          label="新密码"
          placeholder="请输入新密码…"
          fieldProps={{ autoComplete: 'new-password' }}
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6个字符' },
            { max: 128, message: '密码最多128个字符' },
          ]}
        />
      </ModalForm>
    </>
  );
};

export default ResetPasswordModal;
