import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, message, Select, Typography } from 'antd';
import React, { useState } from 'react';
import type {
  CognitiveTrainingCard,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from '@/services/patient-user/typings';
import {
  CognitiveTraining as CognitiveTrainingComponent,
  DietPrescription as DietPrescriptionComponent,
  ExercisePrescription as ExercisePrescriptionComponent,
  MedicationTreatment as MedicationTreatmentComponent,
} from '../../Diagnosis/components';
import useComponentStyles from './components.style';

const { Title } = Typography;

const HealthRecoveryPlan: React.FC = () => {
  const { styles } = useComponentStyles();
  const [form] = Form.useForm();
  const aiSuggestion =
    '根据患者的病情和治疗效果，给出综合建议，包括药物治疗、认知训练、饮食处方、运动处方等。';

  // 状态管理
  const [medicationList, setMedicationList] = useState<MedicationTreatment[]>([
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

  const [cognitiveCards, setCognitiveCards] = useState<CognitiveTrainingCard[]>(
    [
      {
        id: '1',
        cardName: '记忆力翻牌',
        difficulty: '难度：中等',
      },
      {
        id: '2',
        cardName: '逻辑排序',
        difficulty: '难度：高',
      },
      {
        id: '3',
        cardName: '舒尔特方格',
        difficulty: '难度：初级',
      },
    ],
  );

  const [dietPrescription, setDietPrescription] = useState<string>(
    '建议地中海饮食模式：多食深海鱼类、坚果、蔬菜、减少咸肉摄入。补充富含维生素B12的食物。',
  );

  const [exerciseList, setExerciseList] = useState<ExercisePrescription[]>([
    {
      id: '1',
      exerciseName: '有氧运动 (快走/慢跑)',
      duration: '30分钟/天',
    },
    {
      id: '2',
      exerciseName: '手指操 (精细动作)',
      duration: '10分钟/天',
    },
  ]);

  // Modal 状态
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [cognitiveModalVisible, setCognitiveModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  const [editingMedication, setEditingMedication] =
    useState<MedicationTreatment | null>(null);
  const [editingCognitive, setEditingCognitive] =
    useState<CognitiveTrainingCard | null>(null);
  const [editingExercise, setEditingExercise] =
    useState<ExercisePrescription | null>(null);

  // 药物治疗操作
  const handleAddMedication = () => {
    setEditingMedication(null);
    form.resetFields();
    setMedicationModalVisible(true);
  };

  const handleEditMedication = (item: MedicationTreatment) => {
    setEditingMedication(item);
    form.setFieldsValue(item);
    setMedicationModalVisible(true);
  };

  const handleDeleteMedication = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个药物吗？',
      onOk: () => {
        setMedicationList(medicationList.filter((item) => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmitMedication = async () => {
    try {
      const values = await form.validateFields();
      if (editingMedication) {
        setMedicationList(
          medicationList.map((item) =>
            item.id === editingMedication.id ? { ...item, ...values } : item,
          ),
        );
        message.success('修改成功');
      } else {
        const newItem = { id: Date.now().toString(), ...values };
        setMedicationList([...medicationList, newItem]);
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

  const handleEditCognitive = (item: CognitiveTrainingCard) => {
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
    form.setFieldsValue({ content: dietPrescription });
    setDietModalVisible(true);
  };

  const handleSubmitDiet = async () => {
    try {
      const values = await form.validateFields();
      setDietPrescription(values.content);
      message.success('修改成功');
      setDietModalVisible(false);
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

  const handleEditExercise = (item: ExercisePrescription) => {
    setEditingExercise(item);
    form.setFieldsValue(item);
    setExerciseModalVisible(true);
  };

  const handleDeleteExercise = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个运动计划吗？',
      onOk: () => {
        setExerciseList(exerciseList.filter((item) => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmitExercise = async () => {
    try {
      const values = await form.validateFields();
      if (editingExercise) {
        setExerciseList(
          exerciseList.map((item) =>
            item.id === editingExercise.id ? { ...item, ...values } : item,
          ),
        );
        message.success('修改成功');
      } else {
        const newItem = { id: Date.now().toString(), ...values };
        setExerciseList([...exerciseList, newItem]);
        message.success('添加成功');
      }
      setExerciseModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.infoSection}>
        <div className={styles.aiSuggestionBox}>
          <div className={styles.aiSuggestionTitle}>AI综合建议</div>
          <div className={styles.aiSuggestionContent}>{aiSuggestion}</div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <MedicationTreatmentComponent
          medications={medicationList}
          onAdd={handleAddMedication}
          onEdit={handleEditMedication}
          onDelete={handleDeleteMedication}
        />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            认知训练
          </Title>
          <span className={styles.sectionSubtitle}>每日30分钟</span>
        </div>
        <div className={styles.cognitiveCardsContainer}>
          {cognitiveCards.map((item) => (
            <div key={item.id} className={styles.cognitiveCard}>
              <div className={styles.cognitiveCardContent}>
                <div className={styles.cognitiveCardName}>{item.cardName}</div>
                <div className={styles.cognitiveCardDifficulty}>
                  {item.difficulty}
                </div>
              </div>
              <div className={styles.cognitiveCardActions}>
                <Button type="link" onClick={() => handleEditCognitive(item)}>
                  <EditOutlined />
                </Button>
                <Button
                  type="link"
                  onClick={() => handleDeleteCognitive(item.id)}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            </div>
          ))}
          <div className={styles.cognitiveCardAdd} onClick={handleAddCognitive}>
            <div style={{ marginTop: 8, color: '#999' }}>+ 更多关卡</div>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            饮食处方
          </Title>
          <Button type="link" onClick={handleEditDiet}>
            修改计划
          </Button>
        </div>
        <div className={styles.dietContent}>{dietPrescription}</div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            运动处方
          </Title>
          <Button type="link" onClick={handleAddExercise}>
            +添加计划
          </Button>
        </div>
        <div className={styles.exerciseList}>
          {exerciseList.map((item) => (
            <div key={item.id} className={styles.exerciseItem}>
              <div className={styles.exerciseName}>{item.exerciseName}</div>
              <div className={styles.exerciseDuration}>{item.duration}</div>
              <div>
                <Button type="link" onClick={() => handleEditExercise(item)}>
                  <EditOutlined />
                </Button>
                <Button
                  type="link"
                  onClick={() => handleDeleteExercise(item.id)}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 药物治疗弹窗 */}
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
            label="药品数量"
            name="dosage"
            rules={[{ required: true, message: '请输入药品数量' }]}
          >
            <Input placeholder="例如：5mg x 7片" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 认知训练弹窗 */}
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
            label="关卡名称"
            name="cardName"
            rules={[{ required: true, message: '请输入关卡名称' }]}
          >
            <Input placeholder="请输入关卡名称" />
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

      {/* 饮食处方弹窗 */}
      <Modal
        title="修改饮食处方"
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
            label="饮食处方内容"
            name="content"
            rules={[{ required: true, message: '请输入饮食处方内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入饮食处方内容" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 运动处方弹窗 */}
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
            <Input placeholder="例如：30分钟/天" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthRecoveryPlan;
