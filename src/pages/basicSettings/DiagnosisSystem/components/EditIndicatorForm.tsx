import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateImagingIndicator } from '@/services/imaging-indicator';
import type { ImagingIndicator } from '@/services/imaging-indicator/typings.d';
import { updateLabIndicator } from '@/services/lab-indicator';
import type { LabIndicator } from '@/services/lab-indicator/typings.d';

type IndicatorRecord = LabIndicator | ImagingIndicator;

const INDICATOR_CONFIG = {
  lab: { title: '编辑实验室筛查项目', updateFn: updateLabIndicator },
  imaging: { title: '编辑影像学筛查项目', updateFn: updateImagingIndicator },
} as const;

interface EditIndicatorFormProps {
  type: 'lab' | 'imaging';
  trigger: React.ReactElement<{ onClick?: () => void }>;
  record: IndicatorRecord;
  onOk?: () => void;
}

const EditIndicatorForm: React.FC<EditIndicatorFormProps> = ({
  type,
  trigger,
  record,
  onOk,
}) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const config = INDICATOR_CONFIG[type];

  const { run, loading } = useRequest(
    (values: Parameters<typeof updateLabIndicator>[1]) =>
      config.updateFn(record.id, values),
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

  const onOpen = useCallback(() => setOpen(true), []);
  const onCancel = useCallback(() => setOpen(false), []);

  return (
    <>
      {cloneElement(trigger, { onClick: onOpen })}
      <ModalForm
        title={config.title}
        open={open}
        onOpenChange={(visible) => {
          if (!visible) onCancel();
        }}
        initialValues={{
          name: record.name,
          inspection_item: record.inspection_item,
          analysis_suggestion: record.analysis_suggestion,
          notes: record.notes,
          action_guidance: record.action_guidance,
        }}
        width={600}
        modalProps={{
          destroyOnHidden: true,
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
            onCancel();
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
    </>
  );
};

export default EditIndicatorForm;
