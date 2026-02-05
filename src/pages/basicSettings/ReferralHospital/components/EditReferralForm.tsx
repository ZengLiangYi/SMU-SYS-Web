import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateReferral } from '@/services/referral';
import type { Referral } from '@/services/referral/typings.d';

interface EditReferralFormProps {
  trigger?: React.ReactElement<{ onClick?: () => void }>;
  record: Referral;
  onOk?: () => void;
}

const EditReferralForm: React.FC<EditReferralFormProps> = ({
  trigger,
  record,
  onOk,
}) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);

  const { run, loading } = useRequest(
    (values: Parameters<typeof updateReferral>[1]) =>
      updateReferral(record.id, values),
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
        title="编辑转诊医生"
        open={open}
        onOpenChange={(visible) => {
          if (!visible) onCancel();
        }}
        initialValues={{
          hospital_name: record.hospital_name,
          hospital_address: record.hospital_address,
          hospital_phone: record.hospital_phone,
          doctor_name: record.doctor_name,
          title: record.title,
          contact: record.contact,
        }}
        width={500}
        modalProps={{
          destroyOnClose: true,
          okButtonProps: { loading },
        }}
        onFinish={async (values) => {
          try {
            await run({
              hospital_name: values.hospital_name,
              hospital_address: values.hospital_address,
              hospital_phone: values.hospital_phone,
              doctor_name: values.doctor_name,
              title: values.title,
              contact: values.contact,
            });
            onCancel();
            return true;
          } catch {
            // 保持弹窗打开，让用户可以重试
            return false;
          }
        }}
      >
        <ProFormText
          name="hospital_name"
          label="医院名称"
          placeholder="请输入医院名称…"
          rules={[{ required: true, message: '请输入医院名称' }]}
        />
        <ProFormText
          name="hospital_address"
          label="医院地址"
          placeholder="请输入医院地址…"
          rules={[{ required: true, message: '请输入医院地址' }]}
        />
        <ProFormText
          name="hospital_phone"
          label="医院电话"
          placeholder="请输入医院电话…"
          rules={[{ required: true, message: '请输入医院电话' }]}
        />
        <ProFormText
          name="doctor_name"
          label="对接医师姓名"
          placeholder="请输入对接医师姓名…"
          rules={[{ required: true, message: '请输入对接医师姓名' }]}
        />
        <ProFormText
          name="title"
          label="职位"
          placeholder="请输入职位…"
          rules={[{ required: true, message: '请输入职位' }]}
        />
        <ProFormText
          name="contact"
          label="联系方式"
          placeholder="请输入联系方式…"
          rules={[{ required: true, message: '请输入联系方式' }]}
        />
      </ModalForm>
    </>
  );
};

export default EditReferralForm;
