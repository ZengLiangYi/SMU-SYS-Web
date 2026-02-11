import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App } from 'antd';
import type { FC } from 'react';
import { createFollowup } from '@/services/patient-user';

interface CreateFollowupFormProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOk?: () => void;
}

const CreateFollowupForm: FC<CreateFollowupFormProps> = ({
  patientId,
  open,
  onOpenChange,
  onOk,
}) => {
  const { message } = App.useApp();

  const { run, loading } = useRequest(
    (values: {
      subject: string;
      plan_time: string;
      duration_minutes?: number;
    }) => createFollowup(patientId, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('随访记录创建成功');
        onOk?.();
      },
      onError: () => {
        message.error('创建失败，请重试');
      },
    },
  );

  return (
    <ModalForm
      title="创建随访"
      open={open}
      onOpenChange={onOpenChange}
      width={480}
      modalProps={{
        destroyOnClose: true,
        okButtonProps: { loading },
      }}
      onFinish={async (values) => {
        try {
          await run({
            subject: values.subject,
            plan_time: values.plan_time,
            duration_minutes: values.duration_minutes,
          });
          return true;
        } catch {
          return false;
        }
      }}
    >
      <ProFormText
        name="subject"
        label="随访主题"
        placeholder="请输入随访主题…"
        rules={[{ required: true, message: '请输入随访主题' }]}
      />
      <ProFormDateTimePicker
        name="plan_time"
        label="计划随访时间"
        placeholder="请选择计划随访时间"
        rules={[{ required: true, message: '请选择计划随访时间' }]}
        fieldProps={{
          style: { width: '100%' },
          format: 'YYYY-MM-DD HH:mm',
          showTime: { format: 'HH:mm' },
        }}
      />
      <ProFormDigit
        name="duration_minutes"
        label="预计时长（分钟）"
        placeholder="请输入预计时长"
        min={0}
        fieldProps={{ precision: 0 }}
      />
    </ModalForm>
  );
};

export default CreateFollowupForm;
