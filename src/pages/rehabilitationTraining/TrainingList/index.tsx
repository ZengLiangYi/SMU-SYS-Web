import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button, Image, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteRehabLevel, getRehabLevels } from '@/services/rehab-level';
import type { RehabLevel } from '@/services/rehab-level/typings.d';
import { getStaticUrl } from '@/services/static';
import { REHAB_LEVEL_TYPE_ENUM } from '@/utils/constants';
import { formatDateTime } from '@/utils/date';
import CreateTrainingForm from './components/CreateTrainingForm';
import DetailModal from './components/DetailModal';
import EditTrainingForm from './components/EditTrainingForm';

const TrainingList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  // 详情弹窗状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<RehabLevel | null>(null);

  // 删除请求
  const { run: runDelete } = useRequest(deleteRehabLevel, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => {
      message.error('删除失败，请重试');
    },
  });

  // 表格列定义
  const columns: ProColumns<RehabLevel>[] = [
    {
      title: '关卡类型',
      dataIndex: 'level_type',
      valueType: 'select',
      valueEnum: REHAB_LEVEL_TYPE_ENUM,
      width: 100,
      fieldProps: {
        placeholder: '请选择关卡类型…',
      },
    },
    {
      title: '关卡名称',
      dataIndex: 'name',
      width: 100,
      fieldProps: {
        placeholder: '请输入关卡名称…',
      },
    },
    {
      title: '关卡图片',
      dataIndex: 'image_url',
      width: 100,
      search: false,
      render: (_, record) => (
        <Image
          src={getStaticUrl(record.image_url)}
          alt={record.name}
          width={80}
          height={44}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '关卡简介',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '等级范围',
      dataIndex: 'level_range',
      width: 90,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      search: false,
      render: (_, record) => formatDateTime(record.created_at),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
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
          <EditTrainingForm
            trigger={
              <Button type="link" size="small" icon={<EditOutlined />}>
                编辑
              </Button>
            }
            record={record}
            onOk={() => actionRef.current?.reload()}
          />
          <Popconfirm
            title="确认删除"
            description={`确定要删除关卡「${record.name}」吗？`}
            onConfirm={() => runDelete(record.id)}
            okText="确定"
            cancelText="取消"
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

  // 查看详情
  const handleViewDetail = (record: RehabLevel) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  return (
    <PageContainer>
      <ProTable<RehabLevel>
        headerTitle="康复训练关卡列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <CreateTrainingForm
            key="create"
            onOk={() => actionRef.current?.reload()}
          />,
        ]}
        request={async (params) => {
          const { current = 1, pageSize = 10, level_type, name } = params;
          try {
            const { data } = await getRehabLevels({
              offset: (current - 1) * pageSize,
              limit: pageSize,
              level_type: level_type || undefined,
              name: name || undefined,
            });
            return {
              data: data.items,
              total: data.total,
              success: true,
            };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />

      {/* 详情弹窗 */}
      <DetailModal
        visible={detailModalVisible}
        record={viewingRecord}
        onCancel={() => setDetailModalVisible(false)}
      />
    </PageContainer>
  );
};

export default TrainingList;
