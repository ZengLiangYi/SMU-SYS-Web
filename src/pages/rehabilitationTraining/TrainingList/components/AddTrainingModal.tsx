import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Form, Input, Modal, message, Select, Upload } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

interface AddTrainingModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddTrainingModal: React.FC<AddTrainingModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('添加关卡:', values);
      message.success('添加成功');
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <Modal
      title="添加关卡"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="关卡类型"
          name="levelType"
          rules={[{ required: true, message: '请选择关卡类型' }]}
        >
          <Select placeholder="请选择关卡类型">
            <Option value="认知障碍">认知障碍</Option>
            <Option value="情绪障碍">情绪障碍</Option>
            <Option value="精神障碍">精神障碍</Option>
            <Option value="运动障碍">运动障碍</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="关卡名称"
          name="levelName"
          rules={[{ required: true, message: '请输入关卡名称' }]}
        >
          <Input placeholder="请输入关卡名称" />
        </Form.Item>
        <Form.Item label="关卡图片" name="levelImage">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            beforeUpload={() => false}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="关卡简介"
          name="levelIntro"
          rules={[{ required: true, message: '请输入关卡简介' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入关卡简介" />
        </Form.Item>
        <Form.Item
          label="关卡等级范围"
          name="levelRange"
          rules={[{ required: true, message: '请输入关卡等级范围' }]}
        >
          <Input placeholder="例如：1-6" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTrainingModal;
