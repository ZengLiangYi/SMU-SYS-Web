import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import type { UploadFile } from 'antd';
import { App, Form, Upload } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateRehabLevel } from '@/services/rehab-level';
import type { RehabLevel } from '@/services/rehab-level/typings.d';
import { REHAB_LEVEL_TYPES } from '@/utils/constants';
import { getFileUrl, getUploadProps, urlToUploadFile } from '@/utils/upload';

interface EditTrainingFormProps {
  trigger?: React.ReactElement<{ onClick?: () => void }>;
  record: RehabLevel;
  onOk?: () => void;
}

const EditTrainingForm: React.FC<EditTrainingFormProps> = ({
  trigger,
  record,
  onOk,
}) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { run, loading } = useRequest(
    (values: Parameters<typeof updateRehabLevel>[1]) =>
      updateRehabLevel(record.id, values),
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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <>
      {trigger ? cloneElement(trigger, { onClick: onOpen }) : null}
      <ModalForm
        title="编辑关卡"
        open={open}
        onOpenChange={(visible) => {
          if (!visible) onCancel();
        }}
        initialValues={{
          level_type: record.level_type,
          name: record.name,
          description: record.description,
          level_range: record.level_range,
        }}
        width={500}
        modalProps={{
          destroyOnClose: true,
          okButtonProps: { loading },
        }}
        onFinish={async (values) => {
          const imageUrl =
            fileList[0]?.status === 'done' ? getFileUrl(fileList[0]) : '';
          if (!imageUrl) {
            message.error('请上传关卡图片');
            return false;
          }
          try {
            await run({
              level_type: values.level_type,
              name: values.name,
              image_url: imageUrl,
              description: values.description,
              level_range: values.level_range,
            });
            onCancel();
            return true;
          } catch {
            // 保持弹窗打开，让用户可以重试
            return false;
          }
        }}
      >
        <ProFormSelect
          name="level_type"
          label="关卡类型"
          placeholder="请选择关卡类型…"
          rules={[{ required: true, message: '请选择关卡类型' }]}
          options={[...REHAB_LEVEL_TYPES]}
        />
        <ProFormText
          name="name"
          label="关卡名称"
          placeholder="请输入关卡名称…"
          rules={[{ required: true, message: '请输入关卡名称' }]}
        />
        <Form.Item label="关卡图片" required>
          <Upload
            {...getUploadProps({ dir: 'rehab-levels', accept: 'image/*' })}
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <ProFormTextArea
          name="description"
          label="关卡简介"
          placeholder="请输入关卡简介…"
          rules={[{ required: true, message: '请输入关卡简介' }]}
          fieldProps={{ rows: 4 }}
        />
        <ProFormText
          name="level_range"
          label="关卡等级范围"
          placeholder="例如：1-6"
          rules={[{ required: true, message: '请输入关卡等级范围' }]}
        />
      </ModalForm>
    </>
  );
};

export default EditTrainingForm;
