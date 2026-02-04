import {
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import React, { useRef, useState } from 'react';
import {
  AddDiseaseTypeModal,
  DetailModal,
  EditPrescriptionModal,
} from './components';

interface DiseaseTypeItem {
  id: string;
  diseaseCategory: string;
  diseaseName: string;
  diseaseSymptoms: string;
  recoveryPlan: string;
  registrationDoctor: string;
  registrationTime: string;
  prescription?: {
    medications: any[];
    cognitiveCards: any[];
    dietContent: string;
    exercises: any[];
  };
}

// 疾病类别 valueEnum
const diseaseCategoryValueEnum = {
  认知障碍: { text: '认知障碍' },
  情绪障碍: { text: '情绪障碍' },
  精神障碍: { text: '精神障碍' },
  运动障碍: { text: '运动障碍' },
};

const DiseaseTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

  // 弹窗状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [viewingRecord, setViewingRecord] = useState<DiseaseTypeItem | null>(
    null,
  );
  const [editingRecord, setEditingRecord] = useState<DiseaseTypeItem | null>(
    null,
  );

  // 格式化处方显示
  const formatPrescription = (prescription: any) => {
    if (!prescription) return '每天进行认知训练，辅佐药物...';
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
    return parts.join(' | ') || '每天进行认知训练，辅佐药物...';
  };

  // 表格列定义
  const columns: ProColumns<DiseaseTypeItem>[] = [
    {
      title: '疾病类别',
      dataIndex: 'diseaseCategory',
      width: 120,
      valueType: 'select',
      valueEnum: diseaseCategoryValueEnum,
    },
    {
      title: '疾病名称',
      dataIndex: 'diseaseName',
      width: 150,
      fieldProps: {
        placeholder: '请输入疾病类型名称',
      },
    },
    {
      title: '疾病表现',
      dataIndex: 'diseaseSymptoms',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '康复处方',
      dataIndex: 'recoveryPlan',
      width: 280,
      ellipsis: true,
      search: false,
      render: (_, record) => formatPrescription(record.prescription),
    },
    {
      title: '登记医师',
      dataIndex: 'registrationDoctor',
      width: 100,
      search: false,
    },
    {
      title: '登记时间',
      dataIndex: 'registrationTime',
      width: 120,
      search: false,
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
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddSuccess = () => {
    setAddModalVisible(false);
    actionRef.current?.reload();
  };

  const handleViewDetail = (record: DiseaseTypeItem) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleEditPrescription = (record: DiseaseTypeItem) => {
    setEditingRecord(record);
    setPrescriptionModalVisible(true);
  };

  const handlePrescriptionSuccess = () => {
    setPrescriptionModalVisible(false);
    actionRef.current?.reload();
  };

  // 获取模拟数据
  const getMockData = (): DiseaseTypeItem[] => {
    return [
      {
        id: '1',
        diseaseCategory: '认知障碍',
        diseaseName: '阿尔茨海默症',
        diseaseSymptoms: '认知功能障碍...',
        recoveryPlan: '每天进行认知训练，辅佐药物...',
        registrationDoctor: '孙英',
        registrationTime: '1971/07/14',
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
            { id: '1', cardName: '记忆力训练卡片', difficulty: '难度：初级' },
            { id: '2', cardName: '注意力训练卡片', difficulty: '难度：中等' },
          ],
          dietContent: '低盐低脂饮食，多吃新鲜蔬菜水果...',
          exercises: [{ id: '1', exerciseName: '散步', duration: '30分钟/天' }],
        },
      },
      {
        id: '2',
        diseaseCategory: '情绪障碍',
        diseaseName: '抑郁症',
        diseaseSymptoms: '情绪低落、兴趣减退...',
        recoveryPlan: '心理疏导配合药物治疗...',
        registrationDoctor: '李医生',
        registrationTime: '2024/01/15',
        prescription: {
          medications: [
            {
              id: '2',
              medicineName: '舍曲林片',
              usage: '每日1次，早餐后服用',
              dosage: '50mg x 14片',
            },
          ],
          cognitiveCards: [
            { id: '3', cardName: '情绪管理卡片', difficulty: '难度：中等' },
          ],
          dietContent: '均衡饮食，适量补充维生素B族...',
          exercises: [{ id: '2', exerciseName: '瑜伽', duration: '45分钟/天' }],
        },
      },
    ];
  };

  // 请求数据 - 使用 ProTable 传入的 params
  const fetchDiseaseTypeList = async (params: Record<string, any>) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (params.diseaseCategory) {
      filteredData = filteredData.filter(
        (item) => item.diseaseCategory === params.diseaseCategory,
      );
    }

    if (params.diseaseName) {
      filteredData = filteredData.filter((item) =>
        item.diseaseName.includes(params.diseaseName),
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
      <ProTable<DiseaseTypeItem>
        headerTitle="认知疾病类型管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleAdd}
          >
            添加
          </Button>,
        ]}
        request={fetchDiseaseTypeList}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
        }}
      />

      {/* 添加疾病类型弹窗 */}
      <AddDiseaseTypeModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSuccess={handleAddSuccess}
      />

      {/* 详情弹窗 */}
      <DetailModal
        visible={detailModalVisible}
        record={viewingRecord}
        onCancel={() => setDetailModalVisible(false)}
      />

      {/* 修改处方弹窗 */}
      <EditPrescriptionModal
        visible={prescriptionModalVisible}
        record={editingRecord}
        onCancel={() => setPrescriptionModalVisible(false)}
        onSuccess={handlePrescriptionSuccess}
      />
    </PageContainer>
  );
};

export default DiseaseTypeList;
