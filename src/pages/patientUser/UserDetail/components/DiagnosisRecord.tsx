import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, message, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import type { DiagnosisRecord as DiagnosisRecordType } from '@/services/patient-user/typings';
import {
  CognitiveTraining,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from '../../Diagnosis/components';
import '@/components/PrescriptionComponents/index.less';

const DiagnosisRecord: React.FC = () => {
  const diagnosisTableRef = useRef<ActionType>(null);
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [editingPrescription, setEditingPrescription] = useState<any>(null);
  const [viewingRecord, setViewingRecord] =
    useState<DiagnosisRecordType | null>(null);

  // 处方编辑状态
  const [medications, setMedications] = useState<any[]>([]);
  const [cognitiveCards, setCognitiveCards] = useState<any[]>([]);
  const [dietContent, setDietContent] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);

  // Modal 状态
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [cognitiveModalVisible, setCognitiveModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [editingCognitive, setEditingCognitive] = useState<any>(null);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [dataSource, setDataSource] = useState<any[]>([
    {
      id: '1',
      date: '2013/12/08',
      referralDoctor: '康雄',
      diagnosisResult: '轻度认知障碍',
      prescription: {
        medications: [
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
        ],
        cognitiveCards: [
          { id: '1', cardName: '记忆力翻牌', difficulty: '难度：中等' },
          { id: '2', cardName: '逻辑排序', difficulty: '难度：高' },
        ],
        dietContent:
          '建议地中海饮食模式：多食深海鱼类、坚果、蔬菜、减少咸肉摄入。补充富含维生素B12的食物。',
        exercises: [
          {
            id: '1',
            exerciseName: '有氧运动 (快走/慢跑)',
            duration: '30分钟/天',
          },
          { id: '2', exerciseName: '手指操 (精细动作)', duration: '10分钟/天' },
        ],
      },
      status: 1,
    },
  ]);

  // 查看详情
  const handleViewDetail = (record: DiagnosisRecordType) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  // 修改处方
  const handleEditPrescription = (record: any) => {
    setEditingPrescription(record);
    setMedications(record.prescription.medications || []);
    setCognitiveCards(record.prescription.cognitiveCards || []);
    setDietContent(record.prescription.dietContent || '');
    setExercises(record.prescription.exercises || []);
    setPrescriptionModalVisible(true);
  };

  // 提交处方修改
  const handleSubmitPrescription = () => {
    const updatedPrescription = {
      medications,
      cognitiveCards,
      dietContent,
      exercises,
    };

    setDataSource(
      dataSource.map((item) =>
        item.id === editingPrescription?.id
          ? { ...item, prescription: updatedPrescription }
          : item,
      ),
    );
    message.success('修改成功');
    setPrescriptionModalVisible(false);
    diagnosisTableRef.current?.reload();
  };

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

  // 格式化处方显示
  const formatPrescription = (prescription: any) => {
    const parts = [];
    if (prescription.medications?.length > 0) {
      parts.push(`药物${prescription.medications.length}种`);
    }
    if (prescription.cognitiveCards?.length > 0) {
      parts.push(`认知训练${prescription.cognitiveCards.length}项`);
    }
    if (prescription.dietContent) {
      parts.push('饮食处方');
    }
    if (prescription.exercises?.length > 0) {
      parts.push(`运动${prescription.exercises.length}项`);
    }
    return parts.join(' | ') || '暂无';
  };

  // 诊疗记录列定义
  const diagnosisColumns: ProColumns<DiagnosisRecordType>[] = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '接诊医生',
      dataIndex: 'referralDoctor',
      width: 100,
    },
    {
      title: '诊断结果',
      dataIndex: 'diagnosisResult',
      width: 120,
    },
    {
      title: '康复处方',
      dataIndex: 'prescription',
      width: 280,
      render: (prescription) => formatPrescription(prescription),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: () => <span className="status-badge completed">已完成</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space className="action-items">
          <div className="action-item" onClick={() => handleViewDetail(record)}>
            <EyeOutlined />
            <span>详情</span>
          </div>
          <div
            className="action-item"
            onClick={() => handleEditPrescription(record)}
          >
            <EditOutlined />
            <span>修改处方</span>
          </div>
        </Space>
      ),
    },
  ];

  // 获取诊疗记录
  const fetchDiagnosisRecords = async () => {
    return {
      data: dataSource,
      success: true,
      total: dataSource.length,
    };
  };

  return (
    <div className="tab-content">
      <ProTable<DiagnosisRecordType>
        actionRef={diagnosisTableRef}
        rowKey="id"
        search={false}
        options={{
          reload: false,
          density: false,
          fullScreen: false,
          setting: false,
        }}
        scroll={{ x: 1000 }}
        request={fetchDiagnosisRecords}
        columns={diagnosisColumns}
        pagination={{
          pageSize: 8,
        }}
        className="diagnosis-pro-table"
      />

      {/* 详情弹窗 */}
      <Modal
        title="诊疗记录详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {viewingRecord && (
          <div style={{ padding: '20px 0' }}>
            <div
              style={{
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <p style={{ marginBottom: 12, fontSize: 14 }}>
                <strong>日期：</strong>
                {viewingRecord.date}
              </p>
              <p style={{ marginBottom: 12, fontSize: 14 }}>
                <strong>接诊医生：</strong>
                {viewingRecord.referralDoctor}
              </p>
              <p style={{ marginBottom: 12, fontSize: 14 }}>
                <strong>诊断结果：</strong>
                {viewingRecord.diagnosisResult}
              </p>
              <p style={{ marginBottom: 0, fontSize: 14 }}>
                <strong>状态：</strong>
                <span className="status-badge completed">已完成</span>
              </p>
            </div>

            {viewingRecord.prescription ? (
              <div className="prescription-detail-view">
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                  康复处方详情
                </h4>

                {/* 药物治疗 - 只读 */}
                {viewingRecord.prescription.medications?.length > 0 && (
                  <div className="prescription-section">
                    <div className="section-header">
                      <h3 className="section-title">药物治疗</h3>
                    </div>
                    <div className="prescription-list">
                      {viewingRecord.prescription.medications.map(
                        (item: any) => (
                          <div key={item.id} className="prescription-item">
                            <div className="prescription-content">
                              <div className="prescription-name">
                                {item.medicineName}
                              </div>
                              <div className="prescription-detail">
                                用法：{item.usage}
                              </div>
                            </div>
                            <div className="prescription-dosage">
                              {item.dosage}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* 认知训练 - 只读 */}
                {viewingRecord.prescription.cognitiveCards?.length > 0 && (
                  <div className="prescription-section">
                    <div className="section-header">
                      <h3 className="section-title">认知训练</h3>
                      <span className="section-subtitle">每日30分钟</span>
                    </div>
                    <div className="cognitive-cards-container">
                      {viewingRecord.prescription.cognitiveCards.map(
                        (item: any) => (
                          <div key={item.id} className="cognitive-card">
                            <div className="cognitive-card-content">
                              <div className="cognitive-card-name">
                                {item.cardName}
                              </div>
                              <div className="cognitive-card-difficulty">
                                {item.difficulty}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* 饮食处方 - 只读 */}
                {viewingRecord.prescription.dietContent && (
                  <div className="prescription-section">
                    <div className="section-header">
                      <h3 className="section-title">饮食处方</h3>
                    </div>
                    <div className="diet-content">
                      {viewingRecord.prescription.dietContent}
                    </div>
                  </div>
                )}

                {/* 运动处方 - 只读 */}
                {viewingRecord.prescription.exercises?.length > 0 && (
                  <div className="prescription-section">
                    <div className="section-header">
                      <h3 className="section-title">运动处方</h3>
                    </div>
                    <div className="exercise-list">
                      {viewingRecord.prescription.exercises.map((item: any) => (
                        <div key={item.id} className="exercise-item">
                          <div className="exercise-content">
                            <div className="exercise-name">
                              {item.exerciseName}
                            </div>
                          </div>
                          <div className="exercise-duration">
                            {item.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}
              >
                <strong>康复处方：</strong>
                {viewingRecord.rehabilitationPlan}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 修改处方弹窗 */}
      <Modal
        title="修改康复处方"
        open={prescriptionModalVisible}
        onOk={handleSubmitPrescription}
        onCancel={() => setPrescriptionModalVisible(false)}
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
    </div>
  );
};

export default DiagnosisRecord;
