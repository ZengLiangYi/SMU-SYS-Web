import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import {
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  AddDiseaseTypeModal,
  DetailModal,
  EditPrescriptionModal,
} from './components';

const { Option } = Select;

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

const DiseaseTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [filteredCategory, setFilteredCategory] = useState<string>('');
  const [filteredName, setFilteredName] = useState<string>('');

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

  // 表格列定义
  const columns: ProColumns<DiseaseTypeItem>[] = [
    {
      title: '疾病类别',
      dataIndex: 'diseaseCategory',
      width: 120,
    },
    {
      title: '疾病名称',
      dataIndex: 'diseaseName',
      width: 150,
    },
    {
      title: '疾病表现',
      dataIndex: 'diseaseSymptoms',
      width: 200,
      ellipsis: true,
    },
    {
      title: '康复处方',
      dataIndex: 'recoveryPlan',
      width: 280,
      ellipsis: true,
      render: (_, record) => formatPrescription(record.prescription),
    },
    {
      title: '登记医师',
      dataIndex: 'registrationDoctor',
      width: 100,
    },
    {
      title: '登记时间',
      dataIndex: 'registrationTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
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

  const handleQuery = () => {
    setFilteredCategory(searchCategory);
    setFilteredName(searchName);
    actionRef.current?.reload();
  };

  const handleReset = () => {
    setSearchCategory('');
    setSearchName('');
    setFilteredCategory('');
    setFilteredName('');
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

  // 请求数据
  const fetchDiseaseTypeList = async (_params: any) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (filteredCategory) {
      filteredData = filteredData.filter(
        (item) => item.diseaseCategory === filteredCategory,
      );
    }

    if (filteredName) {
      filteredData = filteredData.filter((item) =>
        item.diseaseName.includes(filteredName),
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
      <div className="disease-type-list-page">
        <div className="disease-type-list-card">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="toolbar-item">
                <span className="toolbar-label">所属类别：</span>
                <Select
                  placeholder="请选择疾病类别"
                  allowClear
                  style={{ width: 240 }}
                  value={searchCategory}
                  onChange={(value) => setSearchCategory(value)}
                >
                  <Option value="认知障碍">认知障碍</Option>
                  <Option value="情绪障碍">情绪障碍</Option>
                  <Option value="精神障碍">精神障碍</Option>
                  <Option value="运动障碍">运动障碍</Option>
                </Select>
              </div>
              <div className="toolbar-item">
                <span className="toolbar-label">名称：</span>
                <Input
                  placeholder="请输入疾病类型名称"
                  allowClear
                  style={{ width: 240 }}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            </div>
            <div className="toolbar-right">
              <Button
                className="add-button"
                variant="outlined"
                onClick={handleAdd}
              >
                <PlusCircleOutlined />
                添加
              </Button>
              <Button
                className="query-button"
                variant="solid"
                onClick={handleQuery}
              >
                <SearchOutlined />
                查询
              </Button>
              <Button
                className="reset-button"
                variant="outlined"
                onClick={handleReset}
              >
                <ReloadOutlined />
                重置
              </Button>
            </div>
          </div>

          <ProTable<DiseaseTypeItem>
            actionRef={actionRef}
            rowKey="id"
            search={false}
            options={{
              reload: false,
              density: false,
              fullScreen: false,
              setting: false,
            }}
            request={fetchDiseaseTypeList}
            columns={columns}
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
            }}
          />
        </div>

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
      </div>
    </PageContainer>
  );
};

export default DiseaseTypeList;
