import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button } from 'antd';
import type { FC } from 'react';
import { createImagingIndicator } from '@/services/imaging-indicator';

interface CreateImagingFormProps {
  onOk?: () => void;
}

const CreateImagingForm: FC<CreateImagingFormProps> = ({ onOk }) => {
  const { message } = App.useApp();

  const { run, loading } = useRequest(createImagingIndicator, {
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
      title="添加影像学筛查项目"
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          添加项目
        </Button>
      }
      width={600}
      modalProps={{
        destroyOnClose: true,
        okButtonProps: { loading },
      }}
      onFinish={async (values) => {
        try {
          await run({
            name: values.name,
            inspection_item: values.inspection_item,
            analysis_suggestion: values.analysis_suggestion,
            notes: values.notes,
            action_guidance: values.action_guidance,
          });
          return true;
        } catch {
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label="项目名称"
        placeholder="请输入项目名称…"
        rules={[{ required: true, message: '请输入项目名称' }]}
      />
      <ProFormText
        name="inspection_item"
        label="检查指标"
        placeholder="请输入检查指标…"
        rules={[{ required: true, message: '请输入检查指标' }]}
      />
      <ProFormTextArea
        name="analysis_suggestion"
        label="参考建议"
        placeholder="请输入疾病指标分析参考建议…"
        fieldProps={{ rows: 3 }}
        rules={[{ required: true, message: '请输入参考建议' }]}
      />
      <ProFormTextArea
        name="notes"
        label="注意事项"
        placeholder="请输入注意事项…"
        fieldProps={{ rows: 3 }}
        rules={[{ required: true, message: '请输入注意事项' }]}
      />
      <ProFormTextArea
        name="action_guidance"
        label="行动指引"
        placeholder="请输入行动指引…"
        fieldProps={{ rows: 3 }}
        rules={[{ required: true, message: '请输入行动指引' }]}
      />
    </ModalForm>
  );
};

export default CreateImagingForm;
