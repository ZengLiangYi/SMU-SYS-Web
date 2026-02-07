import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Spin, Tag, Typography } from 'antd';
import React from 'react';
import { getReferrals } from '@/services/patient-user';
import type {
  ExternalReferralItem,
  InternalReferralItem,
} from '@/services/patient-user/typings.d';

const { Title } = Typography;

interface TransferRecordProps {
  patientId: string;
}

// -------- 院内转诊列定义 --------
const inTransferColumns: ProColumns<InternalReferralItem>[] = [
  { title: '转诊日期', dataIndex: 'referral_date', width: 120 },
  {
    title: '转出医生',
    dataIndex: 'from_doctor_name',
    width: 100,
    render: (_, record) => record.from_doctor_name ?? '--',
  },
  {
    title: '接诊医生',
    dataIndex: 'to_doctor_name',
    width: 100,
    render: (_, record) => record.to_doctor_name ?? '--',
  },
  {
    title: '备注',
    dataIndex: 'note',
    width: 200,
    render: (_, record) => record.note ?? '--',
  },
];

// -------- 院外转诊列定义 --------
const outTransferColumns: ProColumns<ExternalReferralItem>[] = [
  { title: '转诊日期', dataIndex: 'referral_date', width: 120 },
  {
    title: '转出医生',
    dataIndex: 'from_doctor_name',
    width: 100,
    render: (_, record) => record.from_doctor_name ?? '--',
  },
  {
    title: '转诊医院',
    dataIndex: 'hospital_name',
    width: 120,
    render: (_, record) => record.hospital_name ?? '--',
  },
  {
    title: '接诊医生',
    dataIndex: 'to_doctor_name',
    width: 100,
    render: (_, record) => record.to_doctor_name ?? '--',
  },
  {
    title: '联系方式',
    dataIndex: 'to_doctor_phone',
    width: 140,
    render: (_, record) => record.to_doctor_phone ?? '--',
  },
  {
    title: '是否同意',
    dataIndex: 'is_accepted',
    width: 100,
    render: (_, record) => (
      <Tag color={record.is_accepted ? 'blue' : 'red'}>
        {record.is_accepted ? '已同意' : '未同意'}
      </Tag>
    ),
  },
];

const TransferRecord: React.FC<TransferRecordProps> = ({ patientId }) => {
  // 单次 API 调用获取院内+院外转诊数据
  const { data, loading } = useRequest(() => getReferrals(patientId), {
    ready: !!patientId,
  });

  if (loading) {
    return (
      <Spin style={{ display: 'block', padding: 40, textAlign: 'center' }} />
    );
  }

  return (
    <div>
      <Title level={5}>院内转诊</Title>
      <ProTable<InternalReferralItem>
        rowKey="id"
        search={false}
        options={false}
        scroll={{ x: 600 }}
        dataSource={data?.internal ?? []}
        columns={inTransferColumns}
        pagination={{ defaultPageSize: 5 }}
      />

      <Title level={5} style={{ marginTop: 24 }}>
        院外转诊
      </Title>
      <ProTable<ExternalReferralItem>
        rowKey="id"
        search={false}
        options={false}
        scroll={{ x: 800 }}
        dataSource={data?.external ?? []}
        columns={outTransferColumns}
        pagination={{ defaultPageSize: 5 }}
      />
    </div>
  );
};

export default TransferRecord;
