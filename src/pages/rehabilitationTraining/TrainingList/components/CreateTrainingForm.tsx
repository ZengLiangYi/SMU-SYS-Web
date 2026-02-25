import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import type { UploadFile } from 'antd';
import { App, Button, Form, Upload } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { createRehabLevel } from '@/services/rehab-level';
import { REHAB_LEVEL_TYPES } from '@/utils/constants';
import { getFileUrl, getUploadProps, uploadCardButton } from '@/utils/upload';

interface CreateTrainingFormProps {
  onOk?: () => void;
}

const CreateTrainingForm: FC<CreateTrainingFormProps> = ({ onOk }) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { run, loading } = useRequest(createRehabLevel, {
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
      title="添加关卡"
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
      onOpenChange={(open) => {
        if (!open) setFileList([]);
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
      <Form.Item
        label="关卡图片"
        required
        rules={[{ required: true, message: '请上传关卡图片' }]}
      >
        <Upload
          {...getUploadProps({ dir: 'rehab-levels', accept: 'image/*' })}
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          maxCount={1}
        >
          {fileList.length >= 1 ? null : uploadCardButton}
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
  );
};

export default CreateTrainingForm;
