import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import type { UploadFile } from 'antd';
import { App, Button, Form, Upload } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { createMedicine } from '@/services/medicine';
import { getFileUrl, getUploadProps } from '@/utils/upload';

interface CreateMedicineFormProps {
  onOk?: () => void;
}

const CreateMedicineForm: FC<CreateMedicineFormProps> = ({ onOk }) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { run, loading } = useRequest(createMedicine, {
    manual: true,
    onSuccess: () => {
      message.success('创建成功');
      onOk?.();
    },
    onError: () => {
      message.error('创建失败，请重试');
    },
  });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <ModalForm
      title="添加药物"
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
      onOpenChange={(open) => {
        if (!open) setFileList([]);
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
      <Form.Item
        label="药物图片"
        required
        rules={[{ required: true, message: '请上传药物图片' }]}
      >
        <Upload
          {...getUploadProps({ dir: 'medicines', accept: 'image/*' })}
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          maxCount={1}
        >
          {fileList.length >= 1 ? null : uploadButton}
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
  );
};

export default CreateMedicineForm;
