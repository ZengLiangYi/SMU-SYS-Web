import {
  EyeOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { App, Button, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import { getPatients } from '@/services/patient-user';
import type { PatientListItem } from '@/services/patient-user/typings.d';
import { CROWD_CATEGORY_ENUM, getCategoryColor } from '@/utils/constants';

const UserList: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  // -------- 表格列定义 --------
  const columns: ProColumns<PatientListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      fixed: 'left',
      fieldProps: { placeholder: '请输入姓名…' },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 60,
      search: false,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 60,
      search: false,
      render: (_, record) => (record.age != null ? `${record.age}岁` : '--'),
    },
    {
      title: '联系人',
      dataIndex: 'contact_name',
      width: 80,
      search: false,
      render: (_, record) => record.contact_name ?? '--',
    },
    {
      title: '诊疗评分',
      dataIndex: 'treatment_score',
      width: 80,
      search: false,
      render: (_, record) => record.treatment_score ?? '--',
    },
    {
      title: '处方日评分',
      dataIndex: 'prescription_daily_score',
      width: 90,
      search: false,
      render: (_, record) => record.prescription_daily_score ?? '--',
    },
    {
      title: '人群分类',
      dataIndex: 'categories',
      width: 160,
      valueType: 'select',
      valueEnum: CROWD_CATEGORY_ENUM,
      fieldProps: { placeholder: '请选择分类…' },
      render: (_, record) =>
        record.categories?.length > 0
          ? record.categories.map((cat) => (
              <Tag
                key={cat}
                color={getCategoryColor(cat)}
                style={{ borderRadius: 12 }}
              >
                {cat}
              </Tag>
            ))
          : '--',
    },
    {
      title: '诊断状态',
      dataIndex: 'diagnosis_status',
      width: 80,
      search: false,
      render: (_, record) =>
        record.diagnosis_status ? <Tag>{record.diagnosis_status}</Tag> : '--',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => history.push(`/patient-user/detail?id=${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SwapOutlined />}
            onClick={() =>
              history.push(`/patient-user/diagnosis?id=${record.id}`)
            }
          >
            转诊
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() =>
              history.push(`/patient-user/diagnosis?id=${record.id}`)
            }
          >
            诊断
          </Button>
          <Button
            type="link"
            size="small"
            icon={<HomeOutlined />}
            onClick={() => message.info(`随访: ${record.name}`)}
          >
            随访
          </Button>
        </Space>
      ),
    },
  ];

  // -------- 列表请求 --------
  const fetchList = async (params: {
    current?: number;
    pageSize?: number;
    name?: string;
    categories?: string;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getPatients({
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
      <ProTable<PatientListItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        request={fetchList}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default UserList;
