import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Image, Input, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import {
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { AddDrugModal, DetailModal, EditDrugModal } from './components';

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

const DrugList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [searchDiseaseType, setSearchDiseaseType] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [filteredDiseaseType, setFilteredDiseaseType] = useState<string>('');
  const [filteredName, setFilteredName] = useState<string>('');

  // 弹窗状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<DrugItem | null>(null);
  const [editingRecord, setEditingRecord] = useState<DrugItem | null>(null);

  // 表格列定义
  const columns: ProColumns<DrugItem>[] = [
    {
      title: '治疗疾病类型',
      dataIndex: 'diseaseType',
      width: 140,
    },
    {
      title: '药物名称',
      dataIndex: 'drugName',
      width: 150,
    },
    {
      title: '药物图片',
      dataIndex: 'drugImage',
      width: 100,
      render: (_, record) => (
        <Image
          src={record.drugImage}
          alt={record.drugName}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '药物功效',
      dataIndex: 'drugEffect',
      width: 250,
      ellipsis: true,
    },
    {
      title: '药物禁忌',
      dataIndex: 'drugContraindication',
      width: 250,
      ellipsis: true,
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
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space className="action-items">
          <div className="action-item" onClick={() => handleViewDetail(record)}>
            <EyeOutlined />
            <span>详情</span>
          </div>
          <div className="action-item" onClick={() => handleEdit(record)}>
            <EditOutlined />
            <span>修改</span>
          </div>
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

  const handleViewDetail = (record: DrugItem) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record: DrugItem) => {
    setEditingRecord(record);
    setEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    actionRef.current?.reload();
  };

  const handleQuery = () => {
    setFilteredDiseaseType(searchDiseaseType);
    setFilteredName(searchName);
    actionRef.current?.reload();
  };

  const handleReset = () => {
    setSearchDiseaseType('');
    setSearchName('');
    setFilteredDiseaseType('');
    setFilteredName('');
    actionRef.current?.reload();
  };

  // 获取模拟数据
  const getMockData = (): DrugItem[] => {
    return [
      {
        id: '1',
        diseaseType: '认知障碍',
        drugName: '盐酸多奈哌齐片',
        drugImage: '/images/pill.png',
        drugEffect: '用于轻度或中度阿尔茨海默型痴呆症状的治疗...',
        drugContraindication: '对本品过敏者禁用，孕妇及哺乳期妇女慎用...',
        registrationDoctor: '孙英',
        registrationTime: '1971/07/14',
      },
      {
        id: '2',
        diseaseType: '认知障碍',
        drugName: '甲钴胺片',
        drugImage: '/images/pill.png',
        drugEffect: '用于周围神经病变的治疗，改善神经传导速度...',
        drugContraindication: '对本品过敏者禁用，严重肾功能不全者慎用...',
        registrationDoctor: '何之',
        registrationTime: '1987/02/13',
      },
      {
        id: '3',
        diseaseType: '情绪障碍',
        drugName: '舍曲林片',
        drugImage: '/images/pill.png',
        drugEffect: '用于治疗抑郁症的相关症状，包括伴随焦虑...',
        drugContraindication: '对本品过敏者禁用，不可与单胺氧化酶抑制剂合用...',
        registrationDoctor: '段宁',
        registrationTime: '1978/04/04',
      },
    ];
  };

  // 请求数据
  const fetchDrugList = async (_params: any) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (filteredDiseaseType) {
      filteredData = filteredData.filter(
        (item) => item.diseaseType === filteredDiseaseType,
      );
    }

    if (filteredName) {
      filteredData = filteredData.filter((item) =>
        item.drugName.includes(filteredName),
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
      <div className="drug-list-page">
        <div className="drug-list-card">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="toolbar-item">
                <span className="toolbar-label">治疗疾病类型：</span>
                <Select
                  placeholder="请选择疾病类别"
                  allowClear
                  style={{ width: 240 }}
                  value={searchDiseaseType}
                  onChange={(value) => setSearchDiseaseType(value)}
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
                  placeholder="请输入药物名称"
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

          <ProTable<DrugItem>
            actionRef={actionRef}
            rowKey="id"
            search={false}
            options={{
              reload: false,
              density: false,
              fullScreen: false,
              setting: false,
            }}
            request={fetchDrugList}
            columns={columns}
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
            }}
          />
        </div>

        {/* 添加药物弹窗 */}
        <AddDrugModal
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

        {/* 修改弹窗 */}
        <EditDrugModal
          visible={editModalVisible}
          record={editingRecord}
          onCancel={() => setEditModalVisible(false)}
          onSuccess={handleEditSuccess}
        />
      </div>
    </PageContainer>
  );
};

export default DrugList;
