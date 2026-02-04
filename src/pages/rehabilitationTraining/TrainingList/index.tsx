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
import { AddTrainingModal, DetailModal, EditTrainingModal } from './components';

const { Option } = Select;

interface TrainingItem {
  id: string;
  levelType: string;
  levelName: string;
  levelImage: string;
  levelIntro: string;
  levelRange: string;
  createTime: string;
}

const TrainingList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [searchLevelType, setSearchLevelType] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [filteredLevelType, setFilteredLevelType] = useState<string>('');
  const [filteredName, setFilteredName] = useState<string>('');

  // 弹窗状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<TrainingItem | null>(null);
  const [editingRecord, setEditingRecord] = useState<TrainingItem | null>(null);

  // 表格列定义
  const columns: ProColumns<TrainingItem>[] = [
    {
      title: '关卡类型',
      dataIndex: 'levelType',
    },
    {
      title: '关卡名称',
      dataIndex: 'levelName',
    },
    {
      title: '关卡图片',
      dataIndex: 'levelImage',
      render: (_, record) => (
        <Image
          src={record.levelImage}
          alt={record.levelName}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '关卡简介',
      dataIndex: 'levelIntro',
      ellipsis: true,
    },
    {
      title: '关卡等级范围',
      dataIndex: 'levelRange',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
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

  const handleViewDetail = (record: TrainingItem) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record: TrainingItem) => {
    setEditingRecord(record);
    setEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    actionRef.current?.reload();
  };

  const handleQuery = () => {
    setFilteredLevelType(searchLevelType);
    setFilteredName(searchName);
    actionRef.current?.reload();
  };

  const handleReset = () => {
    setSearchLevelType('');
    setSearchName('');
    setFilteredLevelType('');
    setFilteredName('');
    actionRef.current?.reload();
  };

  // 获取模拟数据
  const getMockData = (): TrainingItem[] => {
    return [
      {
        id: '1',
        levelType: '认知障碍',
        levelName: '识字',
        levelImage: '/images/train.png',
        levelIntro: '识字能力训练',
        levelRange: '1-6',
        createTime: '1971/07/14',
      },
      {
        id: '2',
        levelType: '认知障碍',
        levelName: '识字',
        levelImage: '/images/train.png',
        levelIntro: '识字能力训练',
        levelRange: '1-6',
        createTime: '1987/02/13',
      },
      {
        id: '3',
        levelType: '认知障碍',
        levelName: '识字',
        levelImage: '/images/train.png',
        levelIntro: '识字能力训练',
        levelRange: '1-6',
        createTime: '1978/04/04',
      },
      {
        id: '4',
        levelType: '认知障碍',
        levelName: '识字',
        levelImage: '/images/train.png',
        levelIntro: '识字能力训练',
        levelRange: '1-6',
        createTime: '2019/07/26',
      },
      {
        id: '5',
        levelType: '认知障碍',
        levelName: '识字',
        levelImage: '/images/train.png',
        levelIntro: '识字能力训练',
        levelRange: '1-6',
        createTime: '1980/07/13',
      },
    ];
  };

  // 请求数据
  const fetchTrainingList = async (params: any) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (filteredLevelType) {
      filteredData = filteredData.filter(
        (item) => item.levelType === filteredLevelType,
      );
    }

    if (filteredName) {
      filteredData = filteredData.filter((item) =>
        item.levelName.includes(filteredName),
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
      <div className="training-list-page">
        <div className="training-list-card">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="toolbar-item">
                <span className="toolbar-label">关卡类型：</span>
                <Select
                  placeholder="全部"
                  allowClear
                  style={{ width: 240 }}
                  value={searchLevelType}
                  onChange={(value) => setSearchLevelType(value)}
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
                  placeholder="请输入关卡名称"
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

          <ProTable<TrainingItem>
            actionRef={actionRef}
            rowKey="id"
            search={false}
            options={{
              reload: false,
              density: false,
              fullScreen: false,
              setting: false,
            }}
            request={fetchTrainingList}
            columns={columns}
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
            }}
          />
        </div>

        {/* 添加关卡弹窗 */}
        <AddTrainingModal
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
        <EditTrainingModal
          visible={editModalVisible}
          record={editingRecord}
          onCancel={() => setEditModalVisible(false)}
          onSuccess={handleEditSuccess}
        />
      </div>
    </PageContainer>
  );
};

export default TrainingList;
