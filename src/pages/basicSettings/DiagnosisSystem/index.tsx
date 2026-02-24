import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProList, ProTable } from '@ant-design/pro-components';
import { history, useRequest, useSearchParams } from '@umijs/max';
import {
  App,
  Button,
  Card,
  List,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
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

const { Text } = Typography;

const TAB_LIST = [
  { key: 'scale', tab: '量表配置' },
  { key: 'lab', tab: '实验室筛查配置' },
  { key: 'imaging', tab: '影像学筛查配置' },
];

const DiagnosisSystem: React.FC = () => {
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'scale';

  const scaleActionRef = useRef<ActionType>(null);
  const labActionRef = useRef<ActionType>(null);
  const imagingActionRef = useRef<ActionType>(null);

  const { run: runDeleteLab } = useRequest(deleteLabIndicator, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      labActionRef.current?.reload();
    },
  });

  const { run: runDeleteImaging } = useRequest(deleteImagingIndicator, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      imagingActionRef.current?.reload();
    },
  });

  const { run: runDeleteScale } = useRequest(deleteDiagnosticScale, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      scaleActionRef.current?.reload();
    },
  });

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  const labColumns: ProColumns<LabIndicator>[] = [
    { title: '指标名称', dataIndex: 'name', width: 150, ellipsis: true },
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
    { title: '注意事项', dataIndex: 'notes', width: 200, ellipsis: true },
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

  const imagingColumns: ProColumns<ImagingIndicator>[] = [
    { title: '条目名称', dataIndex: 'name', width: 150, ellipsis: true },
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
    { title: '注意事项', dataIndex: 'notes', width: 200, ellipsis: true },
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scale':
        return (
          <ProList<DiagnosticScale>
            actionRef={scaleActionRef}
            rowKey="id"
            search={false}
            grid={{ gutter: [16, 16], column: 3 }}
            pagination={{ pageSize: 9 }}
            request={async (params) => {
              const { current = 1, pageSize = 9 } = params;
              const { data } = await getDiagnosticScales({
                offset: (current - 1) * pageSize,
                limit: pageSize,
              });
              return { data: data.items, total: data.total, success: true };
            }}
            toolBarRender={() => [
              <Button
                key="create"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  history.push('/basic-settings/diagnosis-system/scale-form')
                }
              >
                添加量表
              </Button>,
            ]}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <img
                      src={getStaticUrl(item.image_url)}
                      alt={item.name}
                      style={{ height: 160, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <a
                      key="edit"
                      onClick={() =>
                        history.push(
                          `/basic-settings/diagnosis-system/scale-form?id=${item.id}`,
                        )
                      }
                    >
                      <EditOutlined /> 修改
                    </a>,
                    <Popconfirm
                      key="delete"
                      title="确认删除该量表？"
                      onConfirm={() => runDeleteScale(item.id)}
                    >
                      <a style={{ color: 'var(--ant-color-error)' }}>
                        <DeleteOutlined /> 删除
                      </a>
                    </Popconfirm>,
                  ]}
                >
                  <Card.Meta
                    title={item.name}
                    description={
                      <>
                        <Space size={[4, 4]} style={{ marginBlockEnd: 8 }}>
                          {item.primary_diseases
                            .slice(0, 3)
                            .map((d: string) => (
                              <Tag key={d}>{d}</Tag>
                            ))}
                          {item.primary_diseases.length > 3 && (
                            <Tag>+{item.primary_diseases.length - 3}</Tag>
                          )}
                        </Space>
                        <Text type="secondary" style={{ display: 'block' }}>
                          {item.estimated_duration} · {item.question_count}题
                        </Text>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        );
      case 'lab':
        return (
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
            pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          />
        );
      case 'imaging':
        return (
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
            pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer
      tabList={TAB_LIST}
      tabActiveKey={activeTab}
      onTabChange={handleTabChange}
    >
      {renderTabContent()}
    </PageContainer>
  );
};

export default DiagnosisSystem;
