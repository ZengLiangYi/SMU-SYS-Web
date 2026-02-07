import { App, Form, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import {
  CognitiveTraining,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from '@/components/PrescriptionComponents';

interface ComprehensivePrescriptionProps {
  onComplete: () => void;
}

const ComprehensivePrescription: React.FC<ComprehensivePrescriptionProps> = ({
  onComplete: _onComplete,
}) => {
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();

  // 药物治疗
  const [medications, setMedications] = useState([
    {
      id: '1',
      medicineName: '盐酸多奈哌齐片',
      usage: '每日1次，晨起口服',
      dosage: '5mg x 7片',
    },
    {
      id: '2',
      medicineName: '甲钴胺片',
      usage: '每日3次，晨饭口服',
      dosage: '0.5mg x 20片',
    },
  ]);

  // 认知训练
  const [cognitiveCards, setCognitiveCards] = useState([
    { id: '1', cardName: '记忆力翻牌', difficulty: '难度：中等' },
    { id: '2', cardName: '逻辑排序', difficulty: '难度：高' },
    { id: '3', cardName: '舒尔特方格', difficulty: '难度：初级' },
  ]);

  // 饮食处方
  const [dietContent, setDietContent] = useState(
    '建议地中海饮食模式：多食深海鱼类、坚果、蔬菜、减少咸肉摄入。补充富含维生素B12的食物。',
  );

  // 运动处方
  const [exercises, setExercises] = useState([
    { id: '1', exerciseName: '有氧运动 (快走/慢跑)', duration: '30分钟/天' },
    { id: '2', exerciseName: '手指操 (精细动作)', duration: '10分钟/天' },
  ]);

  // Modal 状态
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [cognitiveModalVisible, setCognitiveModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [editingCognitive, setEditingCognitive] = useState<any>(null);
  const [editingExercise, setEditingExercise] = useState<any>(null);

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
    modal.confirm({
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
    modal.confirm({
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
    modal.confirm({
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

  const aiSuggestion =
    '基于患者MCI诊断及MMSE评分24分，建议采用综合干预方案：①药物治疗方面，首选胆碱酯酶抑制剂（多奈哌齐5mg起始）改善认知功能，同时补充甲钴胺促进神经修复；②认知训练以记忆力和执行功能为重点，每日30分钟，循序渐进；③饮食遵循地中海模式，富含Omega-3、维生素B12及叶酸，减少饱和脂肪摄入；④运动处方建议有氧运动结合精细动作训练，改善脑血流及神经可塑性。综合治疗6个月后复查评估。';

  return (
    <div className="diagnosis-content comprehensive-prescription">
      <h3 className="content-title">综合康复处方制定</h3>

      {/* AI建议 */}
      <div className="ai-suggestion-box">
        <div className="ai-label">AI综合建议</div>
        <div className="ai-content">{aiSuggestion}</div>
      </div>

      {/* 药物治疗 */}
      <MedicationTreatment
        medications={medications}
        onAdd={handleAddMedication}
        onEdit={handleEditMedication}
        onDelete={handleDeleteMedication}
      />

      {/* 认知训练 */}
      <CognitiveTraining
        cards={cognitiveCards}
        onAdd={handleAddCognitive}
        onEdit={handleEditCognitive}
        onDelete={handleDeleteCognitive}
      />

      {/* 饮食处方 */}
      <DietPrescription content={dietContent} onEdit={handleEditDiet} />

      {/* 运动处方 */}
      <ExercisePrescription
        exercises={exercises}
        onAdd={handleAddExercise}
        onEdit={handleEditExercise}
        onDelete={handleDeleteExercise}
      />

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
    </div>
  );
};

export default ComprehensivePrescription;
