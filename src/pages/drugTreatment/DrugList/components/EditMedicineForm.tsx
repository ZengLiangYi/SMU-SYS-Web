import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import type { UploadFile } from 'antd';
import { App, Form, Upload } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateMedicine } from '@/services/medicine';
import type { Medicine } from '@/services/medicine/typings.d';
import {
  getFileUrl,
  getUploadProps,
  uploadCardButton,
  urlToUploadFile,
} from '@/utils/upload';

interface EditMedicineFormProps {
  trigger?: React.ReactElement<{ onClick?: () => void }>;
  record: Medicine;
  onOk?: () => void;
}

const EditMedicineForm: React.FC<EditMedicineFormProps> = ({
  trigger,
  record,
  onOk,
}) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { run, loading } = useRequest(
    (values: Parameters<typeof updateMedicine>[1]) =>
      updateMedicine(record.id, values),
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
    // 回显图片
    if (record.image_url) {
      setFileList([urlToUploadFile(record.image_url)]);
    }
    setOpen(true);
  }, [record.image_url]);

  const onCancel = useCallback(() => {
    setOpen(false);
    setFileList([]);
  }, []);

  return (
    <>
      {trigger ? cloneElement(trigger, { onClick: onOpen }) : null}
      <ModalForm
        title="编辑药物"
        open={open}
        onOpenChange={(visible) => {
          if (!visible) onCancel();
        }}
        initialValues={{
          treatment_type: record.treatment_type,
          name: record.name,
          indications: record.indications,
          efficacy: record.efficacy,
          usage: record.usage,
          contraindications: record.contraindications,
        }}
        width={600}
        modalProps={{
          destroyOnClose: true,
          okButtonProps: { loading },
        }}
        onFinish={async (values) => {
          const imageUrl =
            fileList[0]?.status === 'done' ? getFileUrl(fileList[0]) : '';
          if (!imageUrl) {
            message.error('请上传药物图片');
            return false;
          }
          try {
            await run({
              treatment_type: values.treatment_type,
              name: values.name,
              image_url: imageUrl,
              indications: values.indications,
              efficacy: values.efficacy,
              usage: values.usage,
              contraindications: values.contraindications,
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
          name="treatment_type"
          label="药物类型"
          placeholder="请输入药物类型…"
          rules={[{ required: true, message: '请输入药物类型' }]}
        />
        <ProFormText
          name="name"
          label="药物名称"
          placeholder="请输入药物名称…"
          rules={[{ required: true, message: '请输入药物名称' }]}
        />
        <Form.Item label="药物图片" required>
          <Upload
            {...getUploadProps({ dir: 'medicines', accept: 'image/*' })}
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadCardButton}
          </Upload>
        </Form.Item>
        <ProFormTextArea
          name="indications"
          label="适应症"
          placeholder="请输入适应症…"
          fieldProps={{ rows: 3 }}
          rules={[{ required: true, message: '请输入适应症' }]}
        />
        <ProFormTextArea
          name="efficacy"
          label="药物功效"
          placeholder="请输入药物功效…"
          fieldProps={{ rows: 3 }}
          rules={[{ required: true, message: '请输入药物功效' }]}
        />
        <ProFormTextArea
          name="usage"
          label="药物用法"
          placeholder="请输入药物用法…"
          fieldProps={{ rows: 3 }}
          rules={[{ required: true, message: '请输入药物用法' }]}
        />
        <ProFormTextArea
          name="contraindications"
          label="用药禁忌"
          placeholder="请输入用药禁忌…"
          fieldProps={{ rows: 3 }}
          rules={[{ required: true, message: '请输入用药禁忌' }]}
        />
      </ModalForm>
    </>
  );
};

export default EditMedicineForm;
