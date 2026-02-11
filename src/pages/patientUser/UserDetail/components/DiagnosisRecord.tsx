import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Modal, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getDiagnosisHistory } from '@/services/diagnosis';
import type { DiagnosisHistoryItem } from '@/services/diagnosis/typings.d';
import {
  getDiseaseMetadata,
  getDoctorMetadata,
} from '@/services/doctor-metadata';
import { formatDateTime } from '@/utils/date';

interface DiagnosisRecordProps {
  patientId: string;
}

const DiagnosisRecord: React.FC<DiagnosisRecordProps> = ({ patientId }) => {
  const diagnosisTableRef = useRef<ActionType>(null);
  const [viewingRecord, setViewingRecord] =
    useState<DiagnosisHistoryItem | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // doctor_id → name / disease_id → name 映射 (js-set-map-lookups + async-parallel)
  const [doctorMap, setDoctorMap] = useState<Map<string, string>>(new Map());
  const [diseaseMap, setDiseaseMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    Promise.all([getDoctorMetadata(), getDiseaseMetadata()])
      .then(([doctorRes, diseaseRes]) => {
        const dMap = new Map<string, string>();
        for (const d of doctorRes.data) dMap.set(d.id, d.name);
        setDoctorMap(dMap);

        const disMap = new Map<string, string>();
        for (const d of diseaseRes.data) disMap.set(d.id, d.name);
        setDiseaseMap(disMap);
      })
      .catch(() => {});
  }, []);

  const renderDoctorName = (doctorId: string | null) =>
    doctorId ? (doctorMap.get(doctorId) ?? doctorId) : '--';

  const renderDiagnosisResults = (ids: string[]) =>
    ids?.length > 0
      ? ids.map((id) => diseaseMap.get(id) ?? id).join('、')
      : '--';

  const diagnosisColumns: ProColumns<DiagnosisHistoryItem>[] = [
    {
      title: '日期',
      dataIndex: 'created_at',
      width: 160,
      render: (_, record) =>
        record.created_at ? formatDateTime(record.created_at) : '--',
    },
    {
      title: '接诊医生',
      dataIndex: 'doctor_id',
      width: 120,
      render: (_, record) => renderDoctorName(record.doctor_id),
    },
    {
      title: '诊断结果',
      dataIndex: 'diagnosis_results',
      width: 200,
      ellipsis: true,
      render: (_, record) => renderDiagnosisResults(record.diagnosis_results),
    },
    {
      title: '状态',
      dataIndex: 'completed_at',
      width: 100,
      render: (_, record) =>
        record.completed_at ? (
          <Tag color="blue">已完成</Tag>
        ) : (
          <Tag color="orange">诊断中</Tag>
        ),
    },
    {
      title: '完成时间',
      dataIndex: 'completed_at',
      width: 160,
      render: (_, record) =>
        record.completed_at ? formatDateTime(record.completed_at) : '--',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <a
          onClick={() => {
            setViewingRecord(record);
            setDetailModalVisible(true);
          }}
        >
          <EyeOutlined /> 详情
        </a>
      ),
    },
  ];

  return (
    <div>
      <ProTable<DiagnosisHistoryItem>
        actionRef={diagnosisTableRef}
        rowKey="diagnosis_id"
        search={false}
        options={false}
        scroll={{ x: 900 }}
        request={async (params) => {
          const { current = 1, pageSize = 8 } = params;
          try {
            const { data } = await getDiagnosisHistory(patientId, {
              offset: (current - 1) * pageSize,
              limit: pageSize,
            });
            return { data: data.items, total: data.total, success: true };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        columns={diagnosisColumns}
        pagination={{ pageSize: 8 }}
      />

      {/* -------- 详情弹窗 -------- */}
      <Modal
        title="诊疗记录详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        {viewingRecord && (
          <ProDescriptions
            column={2}
            dataSource={viewingRecord}
            columns={[
              {
                title: '日期',
                dataIndex: 'created_at',
                render: (_, record) =>
                  record.created_at ? formatDateTime(record.created_at) : '--',
              },
              {
                title: '接诊医生',
                dataIndex: 'doctor_id',
                render: (_, record) => renderDoctorName(record.doctor_id),
              },
              {
                title: '诊断结果',
                dataIndex: 'diagnosis_results',
                render: (_, record) =>
                  renderDiagnosisResults(record.diagnosis_results),
              },
              {
                title: '状态',
                dataIndex: 'completed_at',
                render: (_, record) =>
                  record.completed_at ? (
                    <Tag color="blue">已完成</Tag>
                  ) : (
                    <Tag color="orange">诊断中</Tag>
                  ),
              },
              {
                title: '完成时间',
                dataIndex: 'completed_at',
                render: (_, record) =>
                  record.completed_at
                    ? formatDateTime(record.completed_at)
                    : '--',
              },
            ]}
          />
        )}
        {/* TODO: 处方详情需要独立的诊疗详情 API 支持 */}
      </Modal>
    </div>
  );
};

export default DiagnosisRecord;
