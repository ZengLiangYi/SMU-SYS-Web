import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateDiseaseType } from '@/services/disease-type';
import type { DiseaseType } from '@/services/disease-type/typings.d';

interface EditDiseaseTypeFormProps {
  trigger?: React.ReactElement<{ onClick?: () => void }>;
  record: DiseaseType;
  onOk?: () => void;
}

const EditDiseaseTypeForm: React.FC<EditDiseaseTypeFormProps> = ({
  trigger,
  record,
  onOk,
}) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);

  const { run, loading } = useRequest(
    (values: Parameters<typeof updateDiseaseType>[1]) =>
      updateDiseaseType(record.id, values),
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
        title="编辑疾病类型"
        open={open}
        onOpenChange={(visible) => {
          if (!visible) onCancel();
        }}
        initialValues={{
          disease_category: record.disease_category,
          disease_name: record.disease_name,
          manifestations: record.manifestations,
          rehab_recommendation: record.rehab_recommendation,
        }}
        width={600}
        modalProps={{
          destroyOnHidden: true,
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
            onCancel();
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
    </>
  );
};

export default EditDiseaseTypeForm;
