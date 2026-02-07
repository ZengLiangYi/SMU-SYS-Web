import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { App, Button, Modal, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import CognitiveTraining from '@/components/PrescriptionComponents/CognitiveTraining';
import DietPrescription from '@/components/PrescriptionComponents/DietPrescription';
import ExercisePrescription from '@/components/PrescriptionComponents/ExercisePrescription';
// 直接路径引用，避免 barrel import (bundle-barrel-imports)
import MedicationTreatment from '@/components/PrescriptionComponents/MedicationTreatment';

const { Title } = Typography;

// -------- 本地类型定义（暂无对应 API） --------
interface DiagnosisRecordType {
  id: string;
  date: string;
  referralDoctor: string;
  diagnosisResult: string;
  rehabilitationPlan?: string;
  prescription?: {
    medications: {
      id: string;
      medicineName: string;
      usage: string;
      dosage: string;
    }[];
    cognitiveCards: { id: string; cardName: string; difficulty: string }[];
    dietContent: string;
    exercises: { id: string; exerciseName: string; duration: string }[];
  };
  status: number;
}

// TODO: 替换为后端 API 接口
const MOCK_DIAGNOSIS_RECORDS: DiagnosisRecordType[] = [
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
];

const DiagnosisRecord: React.FC = () => {
  const { message } = App.useApp();
  const diagnosisTableRef = useRef<ActionType>(null);
  const [dataSource, setDataSource] = useState<DiagnosisRecordType[]>(
    MOCK_DIAGNOSIS_RECORDS,
  );
  const [viewingRecord, setViewingRecord] =
    useState<DiagnosisRecordType | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 处方编辑状态
  const [editingPrescription, setEditingPrescription] =
    useState<DiagnosisRecordType | null>(null);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const [cognitiveCards, setCognitiveCards] = useState<any[]>([]);
  const [dietContent, setDietContent] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);

  const handleEditPrescription = (record: DiagnosisRecordType) => {
    setEditingPrescription(record);
    setMedications(record.prescription?.medications ?? []);
    setCognitiveCards(record.prescription?.cognitiveCards ?? []);
    setDietContent(record.prescription?.dietContent ?? '');
    setExercises(record.prescription?.exercises ?? []);
    setPrescriptionModalVisible(true);
  };

  const handleSubmitPrescription = () => {
    if (!editingPrescription) return;
    const updatedPrescription = {
      medications,
      cognitiveCards,
      dietContent,
      exercises,
    };
    setDataSource((prev) =>
      prev.map((item) =>
        item.id === editingPrescription.id
          ? { ...item, prescription: updatedPrescription }
          : item,
      ),
    );
    message.success('修改成功');
    setPrescriptionModalVisible(false);
    diagnosisTableRef.current?.reload();
  };

  const formatPrescription = (
    prescription: DiagnosisRecordType['prescription'],
  ) => {
    if (!prescription) return '暂无';
    const parts = [];
    if (prescription.medications?.length > 0)
      parts.push(`药物${prescription.medications.length}种`);
    if (prescription.cognitiveCards?.length > 0)
      parts.push(`认知训练${prescription.cognitiveCards.length}项`);
    if (prescription.dietContent) parts.push('饮食处方');
    if (prescription.exercises?.length > 0)
      parts.push(`运动${prescription.exercises.length}项`);
    return parts.join(' | ') || '暂无';
  };

  const diagnosisColumns: ProColumns<DiagnosisRecordType>[] = [
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '接诊医生', dataIndex: 'referralDoctor', width: 100 },
    { title: '诊断结果', dataIndex: 'diagnosisResult', width: 120 },
    {
      title: '康复处方',
      dataIndex: 'prescription',
      width: 280,
      render: (_, record) => formatPrescription(record.prescription),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: () => <Tag color="blue">已完成</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingRecord(record);
              setDetailModalVisible(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPrescription(record)}
          >
            修改处方
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <ProTable<DiagnosisRecordType>
        actionRef={diagnosisTableRef}
        rowKey="id"
        search={false}
        options={false}
        scroll={{ x: 1000 }}
        request={async () => ({
          data: dataSource,
          success: true,
          total: dataSource.length,
        })}
        columns={diagnosisColumns}
        pagination={{ pageSize: 8 }}
      />

      {/* -------- 详情弹窗 -------- */}
      <Modal
        title="诊疗记录详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
        destroyOnHidden
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {viewingRecord && (
          <div>
            <ProDescriptions
              column={2}
              dataSource={viewingRecord}
              columns={[
                { title: '日期', dataIndex: 'date' },
                { title: '接诊医生', dataIndex: 'referralDoctor' },
                { title: '诊断结果', dataIndex: 'diagnosisResult' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: () => <Tag color="blue">已完成</Tag>,
                },
              ]}
            />
            {viewingRecord.prescription && (
              <>
                <Title level={5} style={{ marginTop: 16 }}>
                  康复处方详情
                </Title>
                {viewingRecord.prescription.medications?.length > 0 && (
                  <MedicationTreatment
                    medications={viewingRecord.prescription.medications}
                    onAdd={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                )}
                {viewingRecord.prescription.cognitiveCards?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <CognitiveTraining
                      cards={viewingRecord.prescription.cognitiveCards}
                      onAdd={() => {}}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </div>
                )}
                {viewingRecord.prescription.dietContent && (
                  <div style={{ marginTop: 16 }}>
                    <DietPrescription
                      content={viewingRecord.prescription.dietContent}
                      onEdit={() => {}}
                    />
                  </div>
                )}
                {viewingRecord.prescription.exercises?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <ExercisePrescription
                      exercises={viewingRecord.prescription.exercises}
                      onAdd={() => {}}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* -------- 修改处方弹窗 -------- */}
      <Modal
        title="修改康复处方"
        open={prescriptionModalVisible}
        onOk={handleSubmitPrescription}
        onCancel={() => setPrescriptionModalVisible(false)}
        width={900}
        destroyOnHidden
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        <div style={{ paddingTop: 16 }}>
          <MedicationTreatment
            medications={medications}
            onAdd={() => {
              setMedications((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  medicineName: '',
                  usage: '',
                  dosage: '',
                },
              ]);
            }}
            onEdit={(item: any) => {
              // Inline edit handled by parent state
            }}
            onDelete={(id: string) => {
              setMedications((prev) => prev.filter((m) => m.id !== id));
            }}
          />
          <div style={{ marginTop: 24 }}>
            <CognitiveTraining
              cards={cognitiveCards}
              onAdd={() => {
                setCognitiveCards((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    cardName: '',
                    difficulty: '难度：初级',
                  },
                ]);
              }}
              onEdit={(item: any) => {}}
              onDelete={(id: string) => {
                setCognitiveCards((prev) => prev.filter((c) => c.id !== id));
              }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <DietPrescription content={dietContent} onEdit={() => {}} />
          </div>
          <div style={{ marginTop: 24 }}>
            <ExercisePrescription
              exercises={exercises}
              onAdd={() => {
                setExercises((prev) => [
                  ...prev,
                  { id: Date.now().toString(), exerciseName: '', duration: '' },
                ]);
              }}
              onEdit={(item: any) => {}}
              onDelete={(id: string) => {
                setExercises((prev) => prev.filter((e) => e.id !== id));
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DiagnosisRecord;
