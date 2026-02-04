import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Form, Input, Modal, message, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

interface DrugItem {
  id: string;
  diseaseType: string;
  drugName: string;
  drugImage: string;
  drugEffect: string;
  drugContraindication: string;
  registrationDoctor: string;
  registrationTime: string;
}

interface EditDrugModalProps {
  visible: boolean;
  record: DrugItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditDrugModal: React.FC<EditDrugModalProps> = ({
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
      if (record.drugImage) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: record.drugImage,
          },
        ]);
      }
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('修改药物:', values);
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
      title="修改药物"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="治疗疾病类型"
          name="diseaseType"
          rules={[{ required: true, message: '请选择疾病类型' }]}
        >
          <Select placeholder="请选择疾病类型">
            <Option value="认知障碍">认知障碍</Option>
            <Option value="情绪障碍">情绪障碍</Option>
            <Option value="精神障碍">精神障碍</Option>
            <Option value="运动障碍">运动障碍</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="药物名称"
          name="drugName"
          rules={[{ required: true, message: '请输入药物名称' }]}
        >
          <Input placeholder="请输入药物名称" />
        </Form.Item>
        <Form.Item label="药物图片" name="drugImage">
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
          label="药物功效"
          name="drugEffect"
          rules={[{ required: true, message: '请输入药物功效' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入药物功效" />
        </Form.Item>
        <Form.Item
          label="药物禁忌"
          name="drugContraindication"
          rules={[{ required: true, message: '请输入药物禁忌' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入药物禁忌" />
        </Form.Item>
        <Form.Item
          label="登记医师"
          name="registrationDoctor"
          rules={[{ required: true, message: '请输入登记医师' }]}
        >
          <Input placeholder="请输入登记医师" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDrugModal;
