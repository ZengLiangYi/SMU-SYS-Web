import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Form, Input, Modal, message, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

interface TrainingItem {
  id: string;
  levelType: string;
  levelName: string;
  levelImage: string;
  levelIntro: string;
  levelRange: string;
  createTime: string;
}

interface EditTrainingModalProps {
  visible: boolean;
  record: TrainingItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditTrainingModal: React.FC<EditTrainingModalProps> = ({
  visible,
  record,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue(record);
      if (record.levelImage) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: record.levelImage,
          },
        ]);
      }
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('修改关卡:', values);
      message.success('修改成功');
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
      title="修改关卡"
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

export default EditTrainingModal;
