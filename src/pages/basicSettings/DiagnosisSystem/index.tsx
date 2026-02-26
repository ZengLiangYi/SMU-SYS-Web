import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProList, ProTable } from '@ant-design/pro-components';
import { history, useRequest, useSearchParams } from '@umijs/max';
import {
  App,
  Button,
  Card,
  Image,
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
import { createProTableRequest } from '@/utils/proTableRequest';
import CreateIndicatorForm from './components/CreateIndicatorForm';
import EditIndicatorForm from './components/EditIndicatorForm';

const { Link, Text } = Typography;

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
          <EditIndicatorForm
            type="lab"
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
          <EditIndicatorForm
            type="imaging"
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

  const fetchLabList = createProTableRequest(getLabIndicators);
  const fetchImagingList = createProTableRequest(getImagingIndicators);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scale':
        return (
          <ProList<DiagnosticScale>
            actionRef={scaleActionRef}
            rowKey="id"
            search={false}
            grid={{ gutter: [16, 16], column: 4 }}
            pagination={{ pageSize: 12 }}
            request={async (params) => {
              const { current = 1, pageSize = 12 } = params;
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
                    <Image
                      src={getStaticUrl(item.image_url)}
                      alt={item.name}
                      preview={false}
                      style={{ height: 160, objectFit: 'cover', width: '100%' }}
                    />
                  }
                  actions={[
                    <Link
                      key="edit"
                      onClick={() =>
                        history.push(
                          `/basic-settings/diagnosis-system/scale-form?id=${item.id}`,
                        )
                      }
                    >
                      <EditOutlined /> 修改
                    </Link>,
                    <Popconfirm
                      key="delete"
                      title="确认删除该量表？"
                      onConfirm={() => runDeleteScale(item.id)}
                    >
                      <Link type="danger">
                        <DeleteOutlined /> 删除
                      </Link>
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
            key="lab"
            actionRef={labActionRef}
            rowKey="id"
            search={false}
            options={false}
            toolBarRender={() => [
              <CreateIndicatorForm
                key="create"
                type="lab"
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
            key="imaging"
            actionRef={imagingActionRef}
            rowKey="id"
            search={false}
            options={false}
            toolBarRender={() => [
              <CreateIndicatorForm
                key="create"
                type="imaging"
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
