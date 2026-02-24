import { EyeOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Empty,
  Flex,
  List,
  Modal,
  Pagination,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { getDiagnosisHistory } from '@/services/diagnosis';
import type { DiagnosisHistoryItem } from '@/services/diagnosis/typings.d';
import {
  getDiseaseMetadata,
  getDoctorMetadata,
} from '@/services/doctor-metadata';
import { formatDateTime } from '@/utils/date';

const { Text } = Typography;

const PAGE_SIZE = 8;

interface DiagnosisRecordProps {
  patientId: string;
}

const DiagnosisRecord: React.FC<DiagnosisRecordProps> = ({ patientId }) => {
  const [viewingRecord, setViewingRecord] =
    useState<DiagnosisHistoryItem | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [page, setPage] = useState(1);

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

  const { data: listData, loading } = useRequest(
    () =>
      getDiagnosisHistory(patientId, {
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, page] },
  );

  const items = listData?.items ?? [];

  const renderDoctorName = (doctorId: string | null) =>
    doctorId ? (doctorMap.get(doctorId) ?? doctorId) : '--';

  const renderDiagnosisResults = (ids: string[]) =>
    ids?.length > 0
      ? ids.map((id) => diseaseMap.get(id) ?? id).join('、')
      : '--';

  return (
    <div>
      <Spin spinning={loading}>
        {items.length > 0 ? (
          <>
            <List<DiagnosisHistoryItem>
              dataSource={items}
              renderItem={(item) => (
                <List.Item
                  key={item.diagnosis_id}
                  extra={
                    <a
                      onClick={() => {
                        setViewingRecord(item);
                        setDetailModalVisible(true);
                      }}
                    >
                      <EyeOutlined /> 详情
                    </a>
                  }
                >
                  <List.Item.Meta
                    title={renderDiagnosisResults(item.diagnosis_results)}
                    description={
                      <Flex gap={8} align="center" wrap>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.created_at
                            ? formatDateTime(item.created_at)
                            : '--'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          接诊：{renderDoctorName(item.doctor_id)}
                        </Text>
                        {item.completed_at ? (
                          <Tag color="blue">已完成</Tag>
                        ) : (
                          <Tag color="orange">诊断中</Tag>
                        )}
                      </Flex>
                    }
                  />
                </List.Item>
              )}
            />
            {(listData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end" style={{ marginTop: 8 }}>
                <Pagination
                  size="small"
                  current={page}
                  pageSize={PAGE_SIZE}
                  total={listData?.total ?? 0}
                  onChange={setPage}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无诊疗记录" />
        )}
      </Spin>

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
      </Modal>
    </div>
  );
};

export default DiagnosisRecord;
