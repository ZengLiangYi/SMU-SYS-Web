import { Form, Input, Modal, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  CognitiveTraining,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from '@/components/PrescriptionComponents';

interface PrescriptionData {
  medications?: any[];
  cognitiveCards?: any[];
  dietContent?: string;
  exercises?: any[];
}

interface PrescriptionEditModalProps {
  visible: boolean;
  title?: string;
  initialData?: PrescriptionData;
  onCancel: () => void;
  onSuccess: (data: PrescriptionData) => void;
}

const PrescriptionEditModal: React.FC<PrescriptionEditModalProps> = ({
  visible,
  title = '修改康复处方',
  initialData,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  // 处方状态
  const [medications, setMedications] = useState<any[]>([]);
  const [cognitiveCards, setCognitiveCards] = useState<any[]>([]);
  const [dietContent, setDietContent] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);

  // 子弹窗状态
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [cognitiveModalVisible, setCognitiveModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [editingCognitive, setEditingCognitive] = useState<any>(null);
  const [editingExercise, setEditingExercise] = useState<any>(null);

  useEffect(() => {
    if (visible && initialData) {
      setMedications(initialData.medications || []);
      setCognitiveCards(initialData.cognitiveCards || []);
      setDietContent(initialData.dietContent || '');
      setExercises(initialData.exercises || []);
    }
  }, [visible, initialData]);

  // 药物治疗操作
  const handleAddMedication = () => {
    setEditingMedication(null);
    form.resetFields();
    setMedicationModalVisible(true);
  };

  const handleEditMedication = (item: any) => {
    setEditingMedication(item);
    form.setFieldsValue(item);
    setMedicationModalVisible(true);
  };

  const handleDeleteMedication = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个药物吗？',
      onOk: () => {
        setMedications(medications.filter((item) => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmitMedication = async () => {
    try {
      const values = await form.validateFields();
      if (editingMedication) {
        setMedications(
          medications.map((item) =>
            item.id === editingMedication.id ? { ...item, ...values } : item,
          ),
        );
        message.success('修改成功');
      } else {
        const newItem = { id: Date.now().toString(), ...values };
        setMedications([...medications, newItem]);
        message.success('添加成功');
      }
      setMedicationModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 认知训练操作
  const handleAddCognitive = () => {
    setEditingCognitive(null);
    form.resetFields();
    setCognitiveModalVisible(true);
  };

  const handleEditCognitive = (item: any) => {
    setEditingCognitive(item);
    form.setFieldsValue(item);
    setCognitiveModalVisible(true);
  };

  const handleDeleteCognitive = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个训练卡片吗？',
      onOk: () => {
        setCognitiveCards(cognitiveCards.filter((item) => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmitCognitive = async () => {
    try {
      const values = await form.validateFields();
      if (editingCognitive) {
        setCognitiveCards(
          cognitiveCards.map((item) =>
            item.id === editingCognitive.id ? { ...item, ...values } : item,
          ),
        );
        message.success('修改成功');
      } else {
        const newItem = { id: Date.now().toString(), ...values };
        setCognitiveCards([...cognitiveCards, newItem]);
        message.success('添加成功');
      }
      setCognitiveModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 饮食处方操作
  const handleEditDiet = () => {
    form.setFieldsValue({ dietContent });
    setDietModalVisible(true);
  };

  const handleSubmitDiet = async () => {
    try {
      const values = await form.validateFields();
      setDietContent(values.dietContent);
      setDietModalVisible(false);
      message.success('修改成功');
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 运动处方操作
  const handleAddExercise = () => {
    setEditingExercise(null);
    form.resetFields();
    setExerciseModalVisible(true);
  };

  const handleEditExercise = (item: any) => {
    setEditingExercise(item);
    form.setFieldsValue(item);
    setExerciseModalVisible(true);
  };

  const handleDeleteExercise = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个运动计划吗？',
      onOk: () => {
        setExercises(exercises.filter((item) => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmitExercise = async () => {
    try {
      const values = await form.validateFields();
      if (editingExercise) {
        setExercises(
          exercises.map((item) =>
            item.id === editingExercise.id ? { ...item, ...values } : item,
          ),
        );
        message.success('修改成功');
      } else {
        const newItem = { id: Date.now().toString(), ...values };
        setExercises([...exercises, newItem]);
        message.success('添加成功');
      }
      setExerciseModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleSubmit = () => {
    const prescriptionData = {
      medications,
      cognitiveCards,
      dietContent,
      exercises,
    };
    onSuccess(prescriptionData);
  };

  return (
    <>
      <Modal
        title={title}
        open={visible}
        onOk={handleSubmit}
        onCancel={onCancel}
        width={900}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <div style={{ padding: '20px 0' }}>
          {/* 药物治疗 */}
          <MedicationTreatment
            medications={medications}
            onAdd={handleAddMedication}
            onEdit={handleEditMedication}
            onDelete={handleDeleteMedication}
          />

          {/* 认知训练 */}
          <div style={{ marginTop: '24px' }}>
            <CognitiveTraining
              cards={cognitiveCards}
              onAdd={handleAddCognitive}
              onEdit={handleEditCognitive}
              onDelete={handleDeleteCognitive}
            />
          </div>

          {/* 饮食处方 */}
          <div style={{ marginTop: '24px' }}>
            <DietPrescription content={dietContent} onEdit={handleEditDiet} />
          </div>

          {/* 运动处方 */}
          <div style={{ marginTop: '24px' }}>
            <ExercisePrescription
              exercises={exercises}
              onAdd={handleAddExercise}
              onEdit={handleEditExercise}
              onDelete={handleDeleteExercise}
            />
          </div>
        </div>
      </Modal>

      {/* 药物治疗 Modal */}
      <Modal
        title={editingMedication ? '编辑药物' : '添加药物'}
        open={medicationModalVisible}
        onOk={handleSubmitMedication}
        onCancel={() => {
          setMedicationModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="药品名称"
            name="medicineName"
            rules={[{ required: true, message: '请输入药品名称' }]}
          >
            <Input placeholder="请输入药品名称" />
          </Form.Item>
          <Form.Item
            label="用法"
            name="usage"
            rules={[{ required: true, message: '请输入用法' }]}
          >
            <Input placeholder="请输入用法" />
          </Form.Item>
          <Form.Item
            label="剂量"
            name="dosage"
            rules={[{ required: true, message: '请输入剂量' }]}
          >
            <Input placeholder="请输入剂量" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 认知训练 Modal */}
      <Modal
        title={editingCognitive ? '编辑训练卡片' : '添加训练卡片'}
        open={cognitiveModalVisible}
        onOk={handleSubmitCognitive}
        onCancel={() => {
          setCognitiveModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="卡片名称"
            name="cardName"
            rules={[{ required: true, message: '请输入卡片名称' }]}
          >
            <Input placeholder="请输入卡片名称" />
          </Form.Item>
          <Form.Item
            label="难度"
            name="difficulty"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select placeholder="请选择难度">
              <Select.Option value="难度：初级">难度：初级</Select.Option>
              <Select.Option value="难度：中等">难度：中等</Select.Option>
              <Select.Option value="难度：高">难度：高</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 饮食处方 Modal */}
      <Modal
        title="编辑饮食处方"
        open={dietModalVisible}
        onOk={handleSubmitDiet}
        onCancel={() => {
          setDietModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="饮食建议"
            name="dietContent"
            rules={[{ required: true, message: '请输入饮食建议' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入饮食建议" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 运动处方 Modal */}
      <Modal
        title={editingExercise ? '编辑运动计划' : '添加运动计划'}
        open={exerciseModalVisible}
        onOk={handleSubmitExercise}
        onCancel={() => {
          setExerciseModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="运动名称"
            name="exerciseName"
            rules={[{ required: true, message: '请输入运动名称' }]}
          >
            <Input placeholder="请输入运动名称" />
          </Form.Item>
          <Form.Item
            label="时长"
            name="duration"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <Input placeholder="请输入时长" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PrescriptionEditModal;
