import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { history, useRequest, useSearchParams } from '@umijs/max';
import { App, Button, Image, Popconfirm, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import {
  deleteDiagnosticScale,
  getDiagnosticScales,
} from '@/services/diagnostic-scale';
import type { DiagnosticScale } from '@/services/diagnostic-scale/typings.d';
import {
  deleteImagingIndicator,
  getImagingIndicators,
} from '@/services/imaging-indicator';
import type { ImagingIndicator } from '@/services/imaging-indicator/typings.d';
import { deleteLabIndicator, getLabIndicators } from '@/services/lab-indicator';
import type { LabIndicator } from '@/services/lab-indicator/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';
import CreateImagingForm from './components/CreateImagingForm';
import CreateLabForm from './components/CreateLabForm';
import EditImagingForm from './components/EditImagingForm';
import EditLabForm from './components/EditLabForm';

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

  // -------- 量表删除 --------
  const { run: runDeleteScale } = useRequest(deleteDiagnosticScale, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      scaleActionRef.current?.reload();
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

  // -------- 量表列定义 --------
  const scaleColumns: ProColumns<DiagnosticScale>[] = [
    {
      title: '量表名称',
      dataIndex: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: '量表图片',
      dataIndex: 'image_url',
      width: 80,
      render: (_, record) => (
        <Image
          src={getStaticUrl(record.image_url)}
          alt={record.name}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '适用疾病',
      dataIndex: 'primary_diseases',
      width: 200,
      render: (_, record) => (
        <Space size={[4, 4]} wrap>
          {record.primary_diseases.map((d) => (
            <Tag key={d}>{d}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '量表介绍',
      dataIndex: 'introduction',
      width: 200,
      ellipsis: true,
    },
    {
      title: '预估时长',
      dataIndex: 'estimated_duration',
      width: 100,
    },
    {
      title: '题目数量',
      dataIndex: 'question_count',
      width: 80,
      render: (_, record) => `${record.question_count}题`,
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
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              history.push(
                `/basic-settings/diagnosis-system/scale-form?id=${record.id}`,
              )
            }
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除该量表？"
            onConfirm={() => runDeleteScale(record.id)}
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

  // -------- 量表列表请求 --------
  const fetchScaleList = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getDiagnosticScales({
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
                <ProTable<DiagnosticScale>
                  actionRef={scaleActionRef}
                  rowKey="id"
                  search={false}
                  options={false}
                  toolBarRender={() => [
                    <Button
                      key="create"
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        history.push(
                          '/basic-settings/diagnosis-system/scale-form',
                        )
                      }
                    >
                      添加量表
                    </Button>,
                  ]}
                  request={fetchScaleList}
                  columns={scaleColumns}
                  scroll={{ x: 1400 }}
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
