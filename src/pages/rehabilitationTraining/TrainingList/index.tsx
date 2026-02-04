import {
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Image, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { AddTrainingModal, DetailModal, EditTrainingModal } from './components';

interface TrainingItem {
  id: string;
  levelType: string;
  levelName: string;
  levelImage: string;
  levelIntro: string;
  levelRange: string;
  createTime: string;
}

// 关卡类型 valueEnum
const levelTypeValueEnum = {
  认知障碍: { text: '认知障碍' },
  情绪障碍: { text: '情绪障碍' },
  精神障碍: { text: '精神障碍' },
  运动障碍: { text: '运动障碍' },
};

const TrainingList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

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
      valueType: 'select',
      valueEnum: levelTypeValueEnum,
    },
    {
      title: '关卡名称',
      dataIndex: 'levelName',
      fieldProps: {
        placeholder: '请输入关卡名称',
      },
    },
    {
      title: '关卡图片',
      dataIndex: 'levelImage',
      search: false,
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
      search: false,
    },
    {
      title: '关卡等级范围',
      dataIndex: 'levelRange',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '操作',
      key: 'action',
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
            onClick={() => handleEdit(record)}
          >
            修改
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

  // 请求数据 - 使用 ProTable 传入的 params
  const fetchTrainingList = async (params: Record<string, any>) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (params.levelType) {
      filteredData = filteredData.filter(
        (item) => item.levelType === params.levelType,
      );
    }

    if (params.levelName) {
      filteredData = filteredData.filter((item) =>
        item.levelName.includes(params.levelName),
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
      <ProTable<TrainingItem>
        headerTitle="康复训练关卡列表"
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
        request={fetchTrainingList}
        columns={columns}
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 10,
        }}
      />

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
    </PageContainer>
  );
};

export default TrainingList;
