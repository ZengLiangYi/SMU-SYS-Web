import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button } from 'antd';
import type { FC } from 'react';
import { createDiseaseType } from '@/services/disease-type';

interface CreateDiseaseTypeFormProps {
  onOk?: () => void;
}

const CreateDiseaseTypeForm: FC<CreateDiseaseTypeFormProps> = ({ onOk }) => {
  const { message } = App.useApp();

  const { run, loading } = useRequest(createDiseaseType, {
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
      title="添加疾病类型"
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          添加
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
            disease_category: values.disease_category,
            disease_name: values.disease_name,
            manifestations: values.manifestations,
            rehab_recommendation: values.rehab_recommendation,
          });
          return true;
        } catch {
          // 保持弹窗打开，让用户可以重试
          return false;
        }
      }}
    >
      <ProFormText
        name="disease_category"
        label="疾病类别"
        placeholder="请输入疾病类别…"
        rules={[{ required: true, message: '请输入疾病类别' }]}
      />
      <ProFormText
        name="disease_name"
        label="疾病名称"
        placeholder="请输入疾病名称…"
        rules={[{ required: true, message: '请输入疾病名称' }]}
      />
      <ProFormTextArea
        name="manifestations"
        label="疾病表现"
        placeholder="请输入疾病表现…"
        fieldProps={{ rows: 4 }}
        rules={[{ required: true, message: '请输入疾病表现' }]}
      />
      <ProFormTextArea
        name="rehab_recommendation"
        label="康复处方建议"
        placeholder="请输入康复处方建议…"
        fieldProps={{ rows: 4 }}
        rules={[{ required: true, message: '请输入康复处方建议' }]}
      />
    </ModalForm>
  );
};

export default CreateDiseaseTypeForm;
