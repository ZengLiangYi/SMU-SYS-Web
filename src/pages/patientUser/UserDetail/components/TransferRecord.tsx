import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import { getReferrals } from '@/services/patient-user';
import type {
  ExternalReferralItem,
  InternalReferralItem,
} from '@/services/patient-user/typings.d';
import useComponentStyles from './components.style';

const { Title } = Typography;

interface TransferRecordProps {
  patientId: string;
}

const TransferRecord: React.FC<TransferRecordProps> = ({ patientId }) => {
  const { styles } = useComponentStyles();
  const inTransferTableRef = useRef<ActionType>(null);
  const outTransferTableRef = useRef<ActionType>(null);

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

  // -------- 获取转诊记录（一次请求，分拆两个表） --------
  const fetchInternalReferrals = async () => {
    try {
      const { data } = await getReferrals(patientId);
      return {
        data: data.internal,
        success: true,
        total: data.internal.length,
      };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  const fetchExternalReferrals = async () => {
    try {
      const { data } = await getReferrals(patientId);
      return {
        data: data.external,
        success: true,
        total: data.external.length,
      };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            院内转诊
          </Title>
        </div>
        <ProTable<InternalReferralItem>
          actionRef={inTransferTableRef}
          rowKey="id"
          search={false}
          options={false}
          scroll={{ x: 600 }}
          request={fetchInternalReferrals}
          columns={inTransferColumns}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            院外转诊
          </Title>
        </div>
        <ProTable<ExternalReferralItem>
          actionRef={outTransferTableRef}
          rowKey="id"
          search={false}
          options={false}
          scroll={{ x: 800 }}
          request={fetchExternalReferrals}
          columns={outTransferColumns}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default TransferRecord;
