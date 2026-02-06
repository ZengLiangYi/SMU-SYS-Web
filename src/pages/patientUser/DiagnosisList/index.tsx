import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, message, Select, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import type { DiagnosisRecord } from '../../../services/patient-user/typings';
import { CROWD_CATEGORY, getCategoryColor } from '../../../utils/constants';
import {
  CognitiveTraining,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from '../Diagnosis/components';

interface DiagnosisListItem extends DiagnosisRecord {
  userName: string;
  userCategory: string;
  referringDoctor: string;
}

// 生成 valueEnum
const categoryValueEnum = Object.values(CROWD_CATEGORY).reduce(
  (acc, cat) => {
    acc[cat] = { text: cat };
    return acc;
  },
  {} as Record<string, { text: string }>,
);

const DiagnosisList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [form] = Form.useForm();

  // 详情和处方弹窗状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [_editingPrescription, setEditingPrescription] = useState<any>(null);
  const [viewingRecord, setViewingRecord] = useState<DiagnosisListItem | null>(
    null,
  );

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

  // 格式化处方显示
  const formatPrescription = (prescription: any) => {
    if (!prescription) return '暂无';
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

  // 表格列定义
  const columns: ProColumns<DiagnosisListItem>[] = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 100,
      fixed: 'left',
      search: false,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 80,
      fieldProps: {
        placeholder: '请输入患者姓名',
      },
    },
    {
      title: '人群分类',
      dataIndex: 'userCategory',
      width: 120,
      valueType: 'select',
      valueEnum: categoryValueEnum,
      render: (_, record) => (
        <Tag
          color={getCategoryColor(record.userCategory)}
          style={{ borderRadius: 12 }}
        >
          {record.userCategory}
        </Tag>
      ),
    },
    {
      title: '接诊医生',
      dataIndex: 'referringDoctor',
      width: 80,
      fieldProps: {
        placeholder: '请输入医师姓名',
      },
    },
    {
      title: '诊断结果',
      dataIndex: 'diagnosisResult',
      width: 120,
      search: false,
    },
    {
      title: '康复处方',
      dataIndex: 'prescription',
      width: 280,
      search: false,
      render: (prescription) => formatPrescription(prescription),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      search: false,
      render: (_, record) => (
        <Tag bordered color={record.status === 1 ? 'blue' : 'red'}>
          {record.status === 1 ? '已完成' : '未完成'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            复诊
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPrescription(record)}
          >
            修改处方
          </Button>
        </Space>
      ),
    },
  ];

  // 操作处理函数
  const handleViewDetail = (record: DiagnosisListItem) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleEditPrescription = (record: DiagnosisListItem) => {
    setEditingPrescription(record);
    setMedications(record.prescription?.medications || []);
    setCognitiveCards(record.prescription?.cognitiveCards || []);
    setDietContent(record.prescription?.dietContent || '');
    setExercises(record.prescription?.exercises || []);
    setPrescriptionModalVisible(true);
  };

  const handleSubmitPrescription = () => {
    message.success('修改成功');
    setPrescriptionModalVisible(false);
    actionRef.current?.reload();
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

  // 获取模拟数据
  const getMockData = (): DiagnosisListItem[] => {
    return [
      {
        id: '1',
        date: '2023/06/27',
        userName: '胡超',
        userCategory: CROWD_CATEGORY.NORMAL,
        referringDoctor: '孙英',
        referralDoctor: '孙英',
        diagnosisResult: '老年痴呆',
        prescription: {
          medications: [
            {
              id: '1',
              medicineName: '盐酸多奈哌齐片',
              usage: '每日1次，晨起口服',
              dosage: '5mg x 7片',
            },
          ],
          cognitiveCards: [
            { id: '1', cardName: '记忆力翻牌', difficulty: '难度：中等' },
          ],
          dietContent: '建议地中海饮食模式：多食深海鱼类、坚果、蔬菜。',
          exercises: [
            {
              id: '1',
              exerciseName: '有氧运动 (快走/慢跑)',
              duration: '30分钟/天',
            },
          ],
        },
        status: 1,
      },
      {
        id: '2',
        date: '2006/10/27',
        userName: '田妍',
        userCategory: CROWD_CATEGORY.SCD_WARNING,
        referringDoctor: '何之',
        referralDoctor: '何之',
        diagnosisResult: '老年痴呆',
        prescription: {
          medications: [
            {
              id: '1',
              medicineName: '盐酸多奈哌齐片',
              usage: '每日1次，晨起口服',
              dosage: '5mg x 7片',
            },
          ],
          cognitiveCards: [],
          dietContent: '建议地中海饮食模式',
          exercises: [],
        },
        status: 1,
      },
      {
        id: '3',
        date: '1998/01/19',
        userName: '钱强',
        userCategory: CROWD_CATEGORY.NORMAL,
        referringDoctor: '段宁',
        referralDoctor: '段宁',
        diagnosisResult: '老年痴呆',
        prescription: {
          medications: [],
          cognitiveCards: [],
          dietContent: '建议地中海饮食模式',
          exercises: [],
        },
        status: 1,
      },
      {
        id: '4',
        date: '2004/03/27',
        userName: '谭慧',
        userCategory: CROWD_CATEGORY.NORMAL,
        referringDoctor: '董泰',
        referralDoctor: '董泰',
        diagnosisResult: '老年痴呆',
        prescription: {
          medications: [],
          cognitiveCards: [],
          dietContent: '',
          exercises: [],
        },
        status: 1,
      },
      {
        id: '5',
        date: '1985/06/05',
        userName: '侯霞',
        userCategory: CROWD_CATEGORY.NORMAL,
        referringDoctor: '孙兰',
        referralDoctor: '孙兰',
        diagnosisResult: '老年痴呆',
        prescription: {
          medications: [],
          cognitiveCards: [],
          dietContent: '',
          exercises: [],
        },
        status: 1,
      },
    ];
  };

  // 模拟数据请求 - 使用 ProTable 传入的 params 进行过滤
  const fetchDiagnosisList = async (params: Record<string, any>) => {
    const mockData = getMockData();

    // 应用搜索过滤
    let filteredData = mockData;
    if (params.userName) {
      filteredData = filteredData.filter((item) =>
        item.userName.includes(params.userName),
      );
    }
    if (params.userCategory) {
      filteredData = filteredData.filter(
        (item) => item.userCategory === params.userCategory,
      );
    }
    if (params.referringDoctor) {
      filteredData = filteredData.filter((item) =>
        item.referringDoctor.includes(params.referringDoctor),
      );
    }

    return {
      data: filteredData,
      success: true,
      total: filteredData.length,
    };
  };

  return (
    <PageContainer>
      <ProTable<DiagnosisListItem>
        headerTitle="诊疗记录列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        request={fetchDiagnosisList}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
        }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="诊疗记录详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
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
                <strong>用户名：</strong>
                {viewingRecord.userName}
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
                <Tag bordered color="blue">
                  已完成
                </Tag>
              </p>
            </div>

            {viewingRecord.prescription && (
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
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
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
    </PageContainer>
  );
};

export default DiagnosisList;
