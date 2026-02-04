import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import type {
  OutTransferRecord,
  TransferRecord as TransferRecordType,
} from '@/services/patient-user/typings';

const TransferRecord: React.FC = () => {
  const inTransferTableRef = useRef<ActionType>(null);
  const outTransferTableRef = useRef<ActionType>(null);

  // 获取院内转诊记录数据
  const getInTransferRecords = (): TransferRecordType[] => {
    return [
      {
        id: '1',
        transferTime: '2013/12/08',
        transferOutDoctor: '薛贞',
        referralDoctor: '康雄',
        note: '转诊了',
      },
      {
        id: '2',
        transferTime: '2018/04/10',
        transferOutDoctor: '武泽',
        referralDoctor: '刘群',
        note: '转诊了',
      },
      {
        id: '3',
        transferTime: '1992/05/22',
        transferOutDoctor: '林梅',
        referralDoctor: '江旭',
        note: '转诊了',
      },
    ];
  };

  // 获取院外转诊记录数据
  const getOutTransferRecords = (): OutTransferRecord[] => {
    return [
      {
        id: '1',
        transferTime: '2013/12/08',
        transferHospital: '大医院',
        referralDoctor: '康雄',
        phone: '19158064846',
        hasReplyTransfer: '是',
      },
      {
        id: '2',
        transferTime: '2018/04/10',
        transferHospital: '大医院',
        referralDoctor: '刘群',
        phone: '16724372692',
        hasReplyTransfer: '是',
      },
    ];
  };

  // 院内转诊记录列定义
  const inTransferColumns: ProColumns<TransferRecordType>[] = [
    {
      title: '转诊时间',
      dataIndex: 'transferTime',
      width: 120,
    },
    {
      title: '转出医生',
      dataIndex: 'transferOutDoctor',
      width: 100,
    },
    {
      title: '接诊医生',
      dataIndex: 'referralDoctor',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 200,
    },
  ];

  // 院外转诊记录列定义
  const outTransferColumns: ProColumns<OutTransferRecord>[] = [
    {
      title: '转诊时间',
      dataIndex: 'transferTime',
      width: 120,
    },
    {
      title: '转诊医院',
      dataIndex: 'transferHospital',
      width: 120,
    },
    {
      title: '转诊医生',
      dataIndex: 'referralDoctor',
      width: 100,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      width: 140,
    },
    {
      title: '是否回复转诊',
      dataIndex: 'hasReplyTransfer',
      width: 100,
    },
  ];

  // 获取院内转诊记录
  const fetchInTransferRecords = async () => {
    const mockData = getInTransferRecords();
    return {
      data: mockData,
      success: true,
      total: mockData.length,
    };
  };

  // 获取院外转诊记录
  const fetchOutTransferRecords = async () => {
    const mockData = getOutTransferRecords();
    return {
      data: mockData,
      success: true,
      total: mockData.length,
    };
  };

  return (
    <div className="tab-content">
      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">院内转诊</h3>
        </div>
        <ProTable<TransferRecordType>
          actionRef={inTransferTableRef}
          rowKey="id"
          search={false}
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          scroll={{ x: 1000 }}
          request={fetchInTransferRecords}
          columns={inTransferColumns}
          pagination={{
            pageSize: 5,
          }}
          className="transfer-pro-table"
        />
      </div>

      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">院外转诊</h3>
        </div>
        <ProTable<OutTransferRecord>
          actionRef={outTransferTableRef}
          rowKey="id"
          search={false}
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          scroll={{ x: 1000 }}
          request={fetchOutTransferRecords}
          columns={outTransferColumns}
          pagination={{
            pageSize: 5,
          }}
          className="transfer-pro-table"
        />
      </div>
    </div>
  );
};

export default TransferRecord;
