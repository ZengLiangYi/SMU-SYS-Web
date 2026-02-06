import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { useRequest, useSearchParams } from '@umijs/max';
import { App, Button, Popconfirm, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import {
  deleteImagingIndicator,
  getImagingIndicators,
} from '@/services/imaging-indicator';
import type { ImagingIndicator } from '@/services/imaging-indicator/typings.d';
import { deleteLabIndicator, getLabIndicators } from '@/services/lab-indicator';
import type { LabIndicator } from '@/services/lab-indicator/typings.d';
import { getFeatureColor, getScaleTypeColor } from '@/utils/constants';
import { formatDateTime } from '@/utils/date';
import CreateImagingForm from './components/CreateImagingForm';
import CreateLabForm from './components/CreateLabForm';
import EditImagingForm from './components/EditImagingForm';
import EditLabForm from './components/EditLabForm';

// -------- 量表配置（保留 mock，无 API） --------

interface ScaleConfigItem {
  id: string;
  scaleName: string;
  scaleTargetType: string[];
  difficulty: string;
  features: string[];
  createTime: string;
}

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
    render: () => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />}>
          修改
        </Button>
        <Button type="link" size="small" danger icon={<DeleteOutlined />}>
          删除
        </Button>
      </Space>
    ),
  },
];

const scaleMockData: ScaleConfigItem[] = [
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

const fetchScaleList = async () => ({
  data: scaleMockData,
  success: true,
  total: scaleMockData.length,
});

// -------- 主组件 --------

const DiagnosisSystem: React.FC = () => {
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'scale';

  const scaleActionRef = useRef<ActionType>(null);
  const labActionRef = useRef<ActionType>(null);
  const imagingActionRef = useRef<ActionType>(null);

  // -------- 实验室删除 --------
  const { run: runDeleteLab } = useRequest(deleteLabIndicator, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      labActionRef.current?.reload();
    },
  });

  // -------- 影像学删除 --------
  const { run: runDeleteImaging } = useRequest(deleteImagingIndicator, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      imagingActionRef.current?.reload();
    },
  });

  // -------- Tab 切换 --------
  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  // -------- 实验室列定义 --------
  const labColumns: ProColumns<LabIndicator>[] = [
    {
      title: '指标名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '检查指标',
      dataIndex: 'inspection_item',
      width: 150,
      ellipsis: true,
    },
    {
      title: '参考建议',
      dataIndex: 'analysis_suggestion',
      width: 200,
      ellipsis: true,
    },
    {
      title: '注意事项',
      dataIndex: 'notes',
      width: 200,
      ellipsis: true,
    },
    {
      title: '行动指引',
      dataIndex: 'action_guidance',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      render: (_, record) => formatDateTime(record.created_at),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <EditLabForm
            trigger={
              <Button type="link" size="small" icon={<EditOutlined />}>
                修改
              </Button>
            }
            record={record}
            onOk={() => labActionRef.current?.reload()}
          />
          <Popconfirm
            title="确认删除该指标？"
            onConfirm={() => runDeleteLab(record.id)}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              aria-label="删除"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -------- 影像学列定义 --------
  const imagingColumns: ProColumns<ImagingIndicator>[] = [
    {
      title: '条目名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '检查指标',
      dataIndex: 'inspection_item',
      width: 150,
      ellipsis: true,
    },
    {
      title: '参考建议',
      dataIndex: 'analysis_suggestion',
      width: 200,
      ellipsis: true,
    },
    {
      title: '注意事项',
      dataIndex: 'notes',
      width: 200,
      ellipsis: true,
    },
    {
      title: '行动指引',
      dataIndex: 'action_guidance',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      render: (_, record) => formatDateTime(record.created_at),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <EditImagingForm
            trigger={
              <Button type="link" size="small" icon={<EditOutlined />}>
                修改
              </Button>
            }
            record={record}
            onOk={() => imagingActionRef.current?.reload()}
          />
          <Popconfirm
            title="确认删除该条目？"
            onConfirm={() => runDeleteImaging(record.id)}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              aria-label="删除"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -------- 实验室列表请求 --------
  const fetchLabList = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getLabIndicators({
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  // -------- 影像学列表请求 --------
  const fetchImagingList = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getImagingIndicators({
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  return (
    <PageContainer>
      <ProCard
        tabs={{
          activeKey: activeTab,
          onChange: handleTabChange,
          destroyInactiveTabPane: true,
          items: [
            {
              key: 'scale',
              label: '量表配置',
              children: (
                <ProTable<ScaleConfigItem>
                  actionRef={scaleActionRef}
                  rowKey="id"
                  search={false}
                  options={false}
                  toolBarRender={() => [
                    <Button
                      key="create"
                      type="primary"
                      icon={<PlusCircleOutlined />}
                    >
                      添加
                    </Button>,
                  ]}
                  request={fetchScaleList}
                  columns={scaleColumns}
                  scroll={{ x: 1200 }}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                  }}
                />
              ),
            },
            {
              key: 'lab',
              label: '实验室筛查配置',
              children: (
                <ProTable<LabIndicator>
                  actionRef={labActionRef}
                  rowKey="id"
                  search={false}
                  options={false}
                  toolBarRender={() => [
                    <CreateLabForm
                      key="create"
                      onOk={() => labActionRef.current?.reload()}
                    />,
                  ]}
                  request={fetchLabList}
                  columns={labColumns}
                  scroll={{ x: 1400 }}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                  }}
                />
              ),
            },
            {
              key: 'imaging',
              label: '影像学筛查配置',
              children: (
                <ProTable<ImagingIndicator>
                  actionRef={imagingActionRef}
                  rowKey="id"
                  search={false}
                  options={false}
                  toolBarRender={() => [
                    <CreateImagingForm
                      key="create"
                      onOk={() => imagingActionRef.current?.reload()}
                    />,
                  ]}
                  request={fetchImagingList}
                  columns={imagingColumns}
                  scroll={{ x: 1400 }}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                  }}
                />
              ),
            },
          ],
        }}
      />
    </PageContainer>
  );
};

export default DiagnosisSystem;
