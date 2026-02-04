import { Form, Input, Modal, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  CognitiveTraining,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from '@/components/PrescriptionComponents';

const { Option } = Select;

interface AddDiseaseTypeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddDiseaseTypeModal: React.FC<AddDiseaseTypeModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

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

  const [subForm] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      form.resetFields();
      setMedications([]);
      setCognitiveCards([]);
      setDietContent('');
      setExercises([]);
    }
  }, [visible, form]);

  // 药物治疗操作
  const handleAddMedication = () => {
    setEditingMedication(null);
    subForm.resetFields();
    setMedicationModalVisible(true);
  };

  const handleEditMedication = (item: any) => {
    setEditingMedication(item);
    subForm.setFieldsValue(item);
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
      const values = await subForm.validateFields();
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
      subForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 认知训练操作
  const handleAddCognitive = () => {
    setEditingCognitive(null);
    subForm.resetFields();
    setCognitiveModalVisible(true);
  };

  const handleEditCognitive = (item: any) => {
    setEditingCognitive(item);
    subForm.setFieldsValue(item);
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
      const values = await subForm.validateFields();
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
      subForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 饮食处方操作
  const handleEditDiet = () => {
    subForm.setFieldsValue({ dietContent });
    setDietModalVisible(true);
  };

  const handleSubmitDiet = async () => {
    try {
      const values = await subForm.validateFields();
      setDietContent(values.dietContent);
      setDietModalVisible(false);
      message.success('修改成功');
      subForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 运动处方操作
  const handleAddExercise = () => {
    setEditingExercise(null);
    subForm.resetFields();
    setExerciseModalVisible(true);
  };

  const handleEditExercise = (item: any) => {
    setEditingExercise(item);
    subForm.setFieldsValue(item);
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
      const values = await subForm.validateFields();
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
      subForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(1);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const diseaseTypeData = {
        ...values,
        prescription: {
          medications,
          cognitiveCards,
          dietContent,
          exercises,
        },
        registrationTime: new Date()
          .toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\//g, '/'),
      };
      console.log('添加疾病类型:', diseaseTypeData);
      message.success('添加成功');
      onSuccess();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <>
      <Modal
        title="添加疾病类型"
        open={visible}
        onOk={currentStep === 0 ? handleNext : handleSubmit}
        okText={currentStep === 0 ? '下一步' : '完成'}
        cancelText={currentStep === 0 ? '取消' : '上一步'}
        onCancel={currentStep === 0 ? onCancel : handlePrevious}
        width={currentStep === 0 ? 600 : 900}
        bodyStyle={
          currentStep === 1 ? { maxHeight: '70vh', overflowY: 'auto' } : {}
        }
      >
        {currentStep === 0 ? (
          <Form form={form} layout="vertical">
            <Form.Item
              label="疾病类别"
              name="diseaseCategory"
              rules={[{ required: true, message: '请选择疾病类别' }]}
            >
              <Select placeholder="请选择疾病类别">
                <Option value="认知障碍">认知障碍</Option>
                <Option value="情绪障碍">情绪障碍</Option>
                <Option value="精神障碍">精神障碍</Option>
                <Option value="运动障碍">运动障碍</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="疾病名称"
              name="diseaseName"
              rules={[{ required: true, message: '请输入疾病名称' }]}
            >
              <Input placeholder="请输入疾病名称" />
            </Form.Item>
            <Form.Item
              label="疾病表现"
              name="diseaseSymptoms"
              rules={[{ required: true, message: '请输入疾病表现' }]}
            >
              <Input.TextArea rows={4} placeholder="请输入疾病表现" />
            </Form.Item>
            <Form.Item
              label="登记医师"
              name="registrationDoctor"
              rules={[{ required: true, message: '请输入登记医师' }]}
            >
              <Input placeholder="请输入登记医师" />
            </Form.Item>
          </Form>
        ) : (
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
        )}
      </Modal>

      {/* 药物治疗 Modal */}
      <Modal
        title={editingMedication ? '编辑药物' : '添加药物'}
        open={medicationModalVisible}
        onOk={handleSubmitMedication}
        onCancel={() => {
          setMedicationModalVisible(false);
          subForm.resetFields();
        }}
        width={600}
      >
        <Form form={subForm} layout="vertical">
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
          subForm.resetFields();
        }}
        width={600}
      >
        <Form form={subForm} layout="vertical">
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
          subForm.resetFields();
        }}
        width={600}
      >
        <Form form={subForm} layout="vertical">
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
          subForm.resetFields();
        }}
        width={600}
      >
        <Form form={subForm} layout="vertical">
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

export default AddDiseaseTypeModal;
