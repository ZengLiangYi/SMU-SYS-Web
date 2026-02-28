import { EyeOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  List,
  Modal,
  Pagination,
  Progress,
  Result,
  Row,
  Spin,
  Typography,
  theme,
} from 'antd';
import React, { useState } from 'react';
import {
  getRehabScoreRecordDetail,
  getRehabScoreRecords,
} from '@/services/patient-user';
import type {
  RehabScoreRecordDetail,
  RehabScoreRecordListItem,
} from '@/services/patient-user/typings.d';
import { formatDateTime } from '@/utils/date';

const { Text, Title } = Typography;

// -------- 评分字段映射（静态常量，提升到组件外） --------
const SCORE_FIELDS = [
  { key: 'medication_score', name: '用药', color: '#5b8ff9' },
  { key: 'cognitive_training_score', name: '认知', color: '#b799ff' },
  { key: 'diet_score', name: '饮食', color: '#a44cff' },
  { key: 'exercise_score', name: '运动', color: '#b8d4ff' },
] as const;

interface RehabilitationHistoryProps {
  patientId: string;
}

const PAGE_SIZE = 5;

const RehabilitationHistory: React.FC<RehabilitationHistoryProps> = ({
  patientId,
}) => {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingDetail, setViewingDetail] =
    useState<RehabScoreRecordDetail | null>(null);
  const [historyPage, setHistoryPage] = useState(1);

  const {
    data: latestDetail,
    loading: overviewLoading,
    error: overviewError,
  } = useRequest(
    async () => {
      // 先获取最新一条记录的 ID
      const listRes = await getRehabScoreRecords(patientId, {
        offset: 0,
        limit: 1,
      });
      const items = listRes.data?.items;
      if (!items || items.length === 0) return null;
      // 再获取该记录的完整详情（不手动解包 .data，由 useRequest 自动提取）
      return getRehabScoreRecordDetail(patientId, items[0].id);
    },
    {
      refreshDeps: [patientId],
      onError: () => {
        message.error('获取最新康复评分失败');
      },
    },
  );

  // -------- 详情 Modal：手动触发 --------
  const { run: runFetchDetail, loading: detailLoading } = useRequest(
    (recordId: string) => getRehabScoreRecordDetail(patientId, recordId),
    {
      manual: true,
      onSuccess: (res) => {
        setViewingDetail(res);
        setDetailModalVisible(true);
      },
      onError: () => {
        message.error('获取评分详情失败');
      },
    },
  );

  const { data: historyData, loading: historyLoading } = useRequest(
    () =>
      getRehabScoreRecords(patientId, {
        offset: (historyPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, historyPage] },
  );

  const historyItems = historyData?.items ?? [];

  // -------- 概览区域渲染 --------
  const renderOverview = () => {
    if (overviewLoading) {
      return (
        <Card style={{ marginBottom: 24, textAlign: 'center', padding: 40 }}>
          <Spin />
        </Card>
      );
    }
    if (overviewError) {
      return (
        <Result
          status="error"
          title="加载失败"
          subTitle="获取最新康复评分时出错"
          style={{ marginBottom: 24 }}
        />
      );
    }
    if (!latestDetail) {
      return (
        <Card style={{ marginBottom: 24 }}>
          <Empty description="暂无康复评分记录" />
        </Card>
      );
    }

    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Flex align="baseline" gap={8} style={{ marginBottom: 16 }}>
              <Text strong>综合评分：</Text>
              <Text strong style={{ fontSize: token.fontSizeHeading1 }}>
                {latestDetail.overall_score}
              </Text>
            </Flex>
            {SCORE_FIELDS.map((field) => (
              <Flex
                key={field.key}
                align="center"
                gap={12}
                style={{ marginBottom: 12 }}
              >
                <Text
                  type="secondary"
                  style={{ minWidth: 40, textAlign: 'right' }}
                >
                  {field.name}
                </Text>
                <Progress
                  percent={latestDetail[field.key]}
                  showInfo={false}
                  strokeColor={field.color}
                  style={{ flex: 1, margin: 0 }}
                />
              </Flex>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Alert
            type="warning"
            title="康复建议"
            description={latestDetail.advice || '暂无建议'}
            showIcon
            style={{ height: '100%' }}
          />
        </Col>
      </Row>
    );
  };

  return (
    <div>
      {/* -------- 评分概览 -------- */}
      {renderOverview()}

      {/* -------- 评分历史列表 -------- */}
      <Title level={5}>评分历史</Title>
      <Spin spinning={historyLoading}>
        {historyItems.length > 0 ? (
          <>
            <List<RehabScoreRecordListItem>
              dataSource={historyItems}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  extra={
                    <Button
                      type="link"
                      size="small"
                      icon={<EyeOutlined />}
                      loading={detailLoading}
                      onClick={() => runFetchDetail(item.id)}
                    >
                      详情
                    </Button>
                  }
                >
                  <List.Item.Meta
                    title={
                      <Flex align="baseline" gap={8}>
                        <Text strong style={{ fontSize: token.fontSizeXL }}>
                          {item.overall_score}
                        </Text>
                        <Text type="secondary">分</Text>
                      </Flex>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDateTime(item.evaluated_date)}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
            {(historyData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end" style={{ marginTop: 8 }}>
                <Pagination
                  size="small"
                  current={historyPage}
                  pageSize={PAGE_SIZE}
                  total={historyData?.total ?? 0}
                  onChange={setHistoryPage}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无评分记录" />
        )}
      </Spin>

      {/* -------- 详情 Modal -------- */}
      <Modal
        title="康复评分详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        {viewingDetail ? (
          <ProDescriptions<RehabScoreRecordDetail>
            column={2}
            dataSource={viewingDetail}
            columns={[
              {
                title: '评估日期',
                dataIndex: 'evaluated_date',
                render: (_, record) =>
                  formatDateTime(record.evaluated_date, { showTime: false }),
              },
              {
                title: '综合评分',
                dataIndex: 'overall_score',
              },
              {
                title: '用药评分',
                dataIndex: 'medication_score',
                render: (_, record) => (
                  <Progress
                    percent={record.medication_score}
                    size="small"
                    strokeColor="#5b8ff9"
                  />
                ),
              },
              {
                title: '认知训练评分',
                dataIndex: 'cognitive_training_score',
                render: (_, record) => (
                  <Progress
                    percent={record.cognitive_training_score}
                    size="small"
                    strokeColor="#b799ff"
                  />
                ),
              },
              {
                title: '饮食评分',
                dataIndex: 'diet_score',
                render: (_, record) => (
                  <Progress
                    percent={record.diet_score}
                    size="small"
                    strokeColor="#a44cff"
                  />
                ),
              },
              {
                title: '运动评分',
                dataIndex: 'exercise_score',
                render: (_, record) => (
                  <Progress
                    percent={record.exercise_score}
                    size="small"
                    strokeColor="#b8d4ff"
                  />
                ),
              },
              {
                title: '建议',
                dataIndex: 'advice',
                span: 2,
              },
            ]}
          />
        ) : (
          <Spin
            style={{ display: 'block', textAlign: 'center', padding: 40 }}
          />
        )}
      </Modal>
    </div>
  );
};

export default RehabilitationHistory;
