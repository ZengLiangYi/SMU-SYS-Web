import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import {
  getExternalReferrals,
  getInternalReferrals,
} from '@/services/patient-user';
import type {
  ExternalReferralItem,
  InternalReferralItem,
} from '@/services/patient-user/typings.d';
import { formatDateTime } from '@/utils/date';

const { Title } = Typography;

interface TransferRecordProps {
  patientId: string;
}

// -------- 院内转诊列定义 --------
const inTransferColumns: ProColumns<InternalReferralItem>[] = [
  {
    title: '转诊日期',
    dataIndex: 'referral_date',
    width: 160,
    render: (_, record) => formatDateTime(record.referral_date),
  },
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
  {
    title: '转诊日期',
    dataIndex: 'referral_date',
    width: 160,
    render: (_, record) => formatDateTime(record.referral_date),
  },
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
  const internalActionRef = useRef<ActionType>(null);
  const externalActionRef = useRef<ActionType>(null);

  return (
    <div>
      <Title level={5}>院内转诊</Title>
      <ProTable<InternalReferralItem>
        rowKey="id"
        actionRef={internalActionRef}
        search={false}
        options={false}
        scroll={{ x: 600 }}
        columns={inTransferColumns}
        pagination={{ defaultPageSize: 5 }}
        request={async (params) => {
          const { current = 1, pageSize = 5 } = params;
          const res = await getInternalReferrals(patientId, {
            offset: (current - 1) * pageSize,
            limit: pageSize,
          });
          return {
            data: res.data.items,
            total: res.data.total,
            success: true,
          };
        }}
      />

      <Title level={5} style={{ marginTop: 24 }}>
        院外转诊
      </Title>
      <ProTable<ExternalReferralItem>
        rowKey="id"
        actionRef={externalActionRef}
        search={false}
        options={false}
        scroll={{ x: 800 }}
        columns={outTransferColumns}
        pagination={{ defaultPageSize: 5 }}
        request={async (params) => {
          const { current = 1, pageSize = 5 } = params;
          const res = await getExternalReferrals(patientId, {
            offset: (current - 1) * pageSize,
            limit: pageSize,
          });
          return {
            data: res.data.items,
            total: res.data.total,
            success: true,
          };
        }}
      />
    </div>
  );
};

export default TransferRecord;
