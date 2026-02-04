import {
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Image, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { AddDrugModal, DetailModal, EditDrugModal } from './components';

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

// 疾病类型 valueEnum
const diseaseTypeValueEnum = {
  认知障碍: { text: '认知障碍' },
  情绪障碍: { text: '情绪障碍' },
  精神障碍: { text: '精神障碍' },
  运动障碍: { text: '运动障碍' },
};

const DrugList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

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
      valueType: 'select',
      valueEnum: diseaseTypeValueEnum,
    },
    {
      title: '药物名称',
      dataIndex: 'drugName',
      width: 150,
      fieldProps: {
        placeholder: '请输入药物名称',
      },
    },
    {
      title: '药物图片',
      dataIndex: 'drugImage',
      width: 100,
      search: false,
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
      search: false,
    },
    {
      title: '药物禁忌',
      dataIndex: 'drugContraindication',
      width: 250,
      ellipsis: true,
      search: false,
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
      width: 150,
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

  // 请求数据 - 使用 ProTable 传入的 params
  const fetchDrugList = async (params: Record<string, any>) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (params.diseaseType) {
      filteredData = filteredData.filter(
        (item) => item.diseaseType === params.diseaseType,
      );
    }

    if (params.drugName) {
      filteredData = filteredData.filter((item) =>
        item.drugName.includes(params.drugName),
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
      <ProTable<DrugItem>
        headerTitle="药物列表"
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
        request={fetchDrugList}
        columns={columns}
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 10,
        }}
      />

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
    </PageContainer>
  );
};

export default DrugList;
