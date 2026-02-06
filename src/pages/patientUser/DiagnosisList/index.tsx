import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import { getDiagnosisRecords } from '@/services/diagnosis';
import type { DiagnosisRecordListItem } from '@/services/diagnosis/typings.d';
import { CROWD_CATEGORY_ENUM, getCategoryColor } from '@/utils/constants';
import { formatDateTime } from '@/utils/date';

const DiagnosisList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

  const columns: ProColumns<DiagnosisRecordListItem>[] = [
    {
      title: '诊断日期',
      dataIndex: 'initial_diagnosis_date',
      width: 160,
      search: false,
      render: (_, record) =>
        record.initial_diagnosis_date
          ? formatDateTime(record.initial_diagnosis_date)
          : '--',
    },
    {
      title: '患者姓名',
      dataIndex: 'patient_name',
      width: 100,
      fieldProps: { placeholder: '请输入患者姓名…' },
    },
    {
      title: '人群分类',
      dataIndex: 'category',
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
      title: '接诊医生',
      dataIndex: 'doctor_name',
      width: 100,
      fieldProps: { placeholder: '请输入医师姓名…' },
      render: (_, record) => record.doctor_name ?? '--',
    },
    {
      title: '诊断结果',
      dataIndex: 'diagnosis_results',
      width: 200,
      search: false,
      ellipsis: true,
      render: (_, record) =>
        record.diagnosis_results?.length > 0
          ? record.diagnosis_results.join('、')
          : '--',
    },
    {
      title: '处方概要',
      dataIndex: 'prescription_summary',
      width: 280,
      search: false,
      ellipsis: true,
      render: (_, record) => record.prescription_summary ?? '--',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              // TODO: 跳转到患者详情的诊疗记录 tab
              if (record.prescription_id) {
                history.push(
                  `/patient-user/detail?id=${record.prescription_id}`,
                );
              }
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              // TODO: 跳转到复诊流程
              if (record.prescription_id) {
                history.push(
                  `/patient-user/diagnosis?id=${record.prescription_id}`,
                );
              }
            }}
          >
            复诊
          </Button>
        </Space>
      ),
    },
  ];

  // -------- 列表请求 --------
  const fetchList = async (params: {
    current?: number;
    pageSize?: number;
    patient_name?: string;
    category?: string;
    doctor_name?: string;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getDiagnosisRecords({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        patient_name: params.patient_name,
        category: params.category,
        doctor_name: params.doctor_name,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  return (
    <PageContainer>
      <ProTable<DiagnosisRecordListItem>
        headerTitle="诊疗记录列表"
        actionRef={actionRef}
        rowKey="prescription_id"
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

export default DiagnosisList;
