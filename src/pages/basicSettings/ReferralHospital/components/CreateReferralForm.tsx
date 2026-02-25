import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button } from 'antd';
import type { FC } from 'react';
import { createReferral } from '@/services/referral';

interface CreateReferralFormProps {
  onOk?: () => void;
}

const CreateReferralForm: FC<CreateReferralFormProps> = ({ onOk }) => {
  const { message } = App.useApp();

  const { run, loading } = useRequest(createReferral, {
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
      title="添加转诊医生"
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          添加
        </Button>
      }
      width={500}
      modalProps={{
        destroyOnHidden: true,
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
  );
};

export default CreateReferralForm;
