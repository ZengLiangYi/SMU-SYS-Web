import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Image, Space, Tabs, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { getFeatureColor, getScaleTypeColor } from '@/utils/constants';

const { TabPane } = Tabs;

// 量表配置数据类型
interface ScaleConfigItem {
  id: string;
  scaleName: string;
  scaleTargetType: string[];
  difficulty: string;
  features: string[];
  createTime: string;
}

// 实验室常备数据类型
interface LabItem {
  id: string;
  indicatorName: string;
  indicatorEnglishName: string;
  indicatorData: string;
  indicatorUnit: string;
  indicatorReferenceRange: string;
  createTime: string;
}

// 影像学常备数据类型
interface ImagingItem {
  id: string;
  imagingImage: string;
  projectName: string;
  referenceOrPrecautions: string;
  createTime: string;
}

const DiagnosisSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scale');
  const scaleActionRef = useRef<ActionType>(null);
  const labActionRef = useRef<ActionType>(null);
  const imagingActionRef = useRef<ActionType>(null);

  // 量表配置列定义
  const scaleColumns: ProColumns<ScaleConfigItem>[] = [
    {
      title: '量表名称',
      dataIndex: 'scaleName',
      width: 200,
    },
    {
      title: '量表题目类型',
      dataIndex: 'scaleTargetType',
      width: 200,
      render: (_, record) => (
        <Space size={[8, 8]} wrap>
          {record.scaleTargetType.map((type) => (
            <Tag
              key={type}
              color={getScaleTypeColor(type)}
              style={{ borderRadius: 12 }}
            >
              {type}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '题量',
      dataIndex: 'difficulty',
      width: 100,
    },
    {
      title: '功能支持',
      dataIndex: 'features',
      width: 200,
      render: (_, record) => (
        <Space size={[8, 8]} wrap>
          {record.features.map((feature) => (
            <Tag
              key={feature}
              color={getFeatureColor(feature)}
              style={{ borderRadius: 12 }}
            >
              {feature}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space className="action-items">
          <div className="action-item" onClick={() => handleScaleEdit(record)}>
            <EditOutlined />
            <span> 修改</span>
          </div>
          <div
            className="action-item delete"
            onClick={() => handleScaleDelete(record)}
          >
            <DeleteOutlined />
            <span> 删除</span>
          </div>
        </Space>
      ),
    },
  ];

  // 实验室常备列定义
  const labColumns: ProColumns<LabItem>[] = [
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      width: 150,
    },
    {
      title: '指标英文名称',
      dataIndex: 'indicatorEnglishName',
      width: 150,
    },
    {
      title: '指标数据',
      dataIndex: 'indicatorData',
      width: 200,
    },
    {
      title: '指标单位',
      dataIndex: 'indicatorUnit',
      width: 100,
    },
    {
      title: '指标参考范围',
      dataIndex: 'indicatorReferenceRange',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="action-item" onClick={() => handleLabEdit(record)}>
          <EditOutlined />
          <span> 修改</span>
        </div>
      ),
    },
  ];

  // 影像学常备列定义
  const imagingColumns: ProColumns<ImagingItem>[] = [
    {
      title: '图片',
      dataIndex: 'imagingImage',
      width: 80,
      render: (_, record) => (
        <Image
          src={record.imagingImage}
          alt={record.projectName}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 200,
    },
    {
      title: '参考建议/注意事项',
      dataIndex: 'referenceOrPrecautions',
      width: 400,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="action-item" onClick={() => handleImagingEdit(record)}>
          <EditOutlined />
          <span> 修改</span>
        </div>
      ),
    },
  ];

  // 操作处理函数
  const handleScaleEdit = (record: ScaleConfigItem) => {
    console.log('编辑量表:', record);
  };

  const handleScaleDelete = (record: ScaleConfigItem) => {
    console.log('删除量表:', record);
  };

  const handleLabEdit = (record: LabItem) => {
    console.log('编辑实验室指标:', record);
  };

  const handleImagingEdit = (record: ImagingItem) => {
    console.log('编辑影像学项目:', record);
  };

  const handleAdd = () => {
    console.log('添加', activeTab);
  };

  // 获取量表配置模拟数据
  const getScaleMockData = (): ScaleConfigItem[] => {
    return [
      {
        id: '1',
        scaleName: 'AD-8 极早期痴呆筛查量表',
        scaleTargetType: ['单选题', '判断题'],
        difficulty: '8题',
        features: ['录音'],
        createTime: '1971/07/14',
      },
      {
        id: '2',
        scaleName: 'MMSE 简易精神状态检查',
        scaleTargetType: ['单选题', '简答题', '画图'],
        difficulty: '30题',
        features: ['录音', '图片'],
        createTime: '1987/02/13',
      },
    ];
  };

  // 获取实验室常备模拟数据
  const getLabMockData = (): LabItem[] => {
    return [
      {
        id: '1',
        indicatorName: '血常规',
        indicatorEnglishName: 'CBC',
        indicatorData: '白细胞, 红细胞, 血小板',
        indicatorUnit: '-',
        indicatorReferenceRange: '-',
        createTime: '1971/07/14',
      },
      {
        id: '2',
        indicatorName: '糖化血红蛋白',
        indicatorEnglishName: 'HbA1c',
        indicatorData: 'HbA1c',
        indicatorUnit: '%',
        indicatorReferenceRange: '4.0 - 6.0',
        createTime: '1987/02/13',
      },
      {
        id: '3',
        indicatorName: '同型半胱氨酸',
        indicatorEnglishName: 'Hcy',
        indicatorData: 'Hcy',
        indicatorUnit: 'μmol/L',
        indicatorReferenceRange: '5 - 15',
        createTime: '1987/02/13',
      },
      {
        id: '4',
        indicatorName: '甲状腺功能',
        indicatorEnglishName: 'TSH ± FT4',
        indicatorData: 'TSH ± FT4',
        indicatorUnit: 'mIU/L',
        indicatorReferenceRange: '0.27 - 4.2',
        createTime: '1987/02/13',
      },
      {
        id: '5',
        indicatorName: '维生素B12',
        indicatorEnglishName: 'Vit B12',
        indicatorData: 'Vit B12',
        indicatorUnit: 'pg/mL',
        indicatorReferenceRange: '200 - 900',
        createTime: '1987/02/13',
      },
    ];
  };

  // 获取影像学常备模拟数据
  const getImagingMockData = (): ImagingItem[] => {
    return [
      {
        id: '1',
        imagingImage: '/images/train.png',
        projectName: 'PET-CT',
        referenceOrPrecautions: '需空腹6小时以上，检查前大量饮水',
        createTime: '1971/07/14',
      },
      {
        id: '2',
        imagingImage: '/images/train.png',
        projectName: '头颅MRI',
        referenceOrPrecautions: '去除身上所有金属物品',
        createTime: '1987/02/13',
      },
    ];
  };

  // 请求数据
  const fetchScaleList = async () => {
    return {
      data: getScaleMockData(),
      success: true,
      total: getScaleMockData().length,
    };
  };

  const fetchLabList = async () => {
    return {
      data: getLabMockData(),
      success: true,
      total: getLabMockData().length,
    };
  };

  const fetchImagingList = async () => {
    return {
      data: getImagingMockData(),
      success: true,
      total: getImagingMockData().length,
    };
  };

  return (
    <PageContainer>
      <div className="diagnosis-system-page">
        <div className="diagnosis-system-card">
          <Button className="add-button" variant="outlined" onClick={handleAdd}>
            <PlusCircleOutlined />
            添加
          </Button>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="量表配置" key="scale">
              <ProTable<ScaleConfigItem>
                actionRef={scaleActionRef}
                rowKey="id"
                search={false}
                options={{
                  reload: false,
                  density: false,
                  fullScreen: false,
                  setting: false,
                }}
                request={fetchScaleList}
                columns={scaleColumns}
                scroll={{ x: 1200 }}
                pagination={{
                  pageSize: 10,
                }}
              />
            </TabPane>
            <TabPane tab="实验室常备" key="lab">
              <ProTable<LabItem>
                actionRef={labActionRef}
                rowKey="id"
                search={false}
                options={{
                  reload: false,
                  density: false,
                  fullScreen: false,
                  setting: false,
                }}
                request={fetchLabList}
                columns={labColumns}
                scroll={{ x: 1000 }}
                pagination={{
                  pageSize: 10,
                }}
              />
            </TabPane>
            <TabPane tab="影像学常备" key="imaging">
              <ProTable<ImagingItem>
                actionRef={imagingActionRef}
                rowKey="id"
                search={false}
                options={{
                  reload: false,
                  density: false,
                  fullScreen: false,
                  setting: false,
                }}
                request={fetchImagingList}
                columns={imagingColumns}
                scroll={{ x: 1000 }}
                pagination={{
                  pageSize: 10,
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default DiagnosisSystem;
