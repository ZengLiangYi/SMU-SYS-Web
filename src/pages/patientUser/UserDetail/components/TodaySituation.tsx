import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Image,
  List,
  Pagination,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import {
  getDietRecords,
  getExerciseRecords,
  getHealthMetrics,
  getMedicationRecords,
} from '@/services/patient-user';
import type {
  DietRecordItem,
  ExerciseRecordItem,
  HealthMetricItem,
  MedicationRecordItem,
} from '@/services/patient-user/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';

const { Title, Text } = Typography;

interface CognitiveTrainingRecord {
  id: string;
  trainingTime: string;
  trainingDuration: string;
  cardName: string;
  cardImage: string;
  cardCount: number;
  times: number;
  level: number;
  completionStatus: number;
}

// TODO: 替换为后端 API 接口
const MOCK_COGNITIVE_TRAINING_RECORDS: CognitiveTrainingRecord[] = [
  {
    id: '1',
    trainingTime: '11:57',
    trainingDuration: '18分钟',
    cardName: '第一关',
    cardImage: '',
    cardCount: 99,
    times: 5,
    level: 1,
    completionStatus: 1,
  },
];

const MEAL_TYPE_MAP: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

const PAGE_SIZE = 5;

interface TodaySituationProps {
  patientId: string;
}

const TodaySituation: React.FC<TodaySituationProps> = ({ patientId }) => {
  const healthMetricTableRef = useRef<ActionType>(null);

  // 用药记录
  const [medPage, setMedPage] = useState(1);
  const { data: medData, loading: medLoading } = useRequest(
    () =>
      getMedicationRecords(patientId, {
        offset: (medPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, medPage] },
  );

  // 饮食记录
  const [dietPage, setDietPage] = useState(1);
  const { data: dietData, loading: dietLoading } = useRequest(
    () =>
      getDietRecords(patientId, {
        offset: (dietPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, dietPage] },
  );

  // 运动记录
  const [exercisePage, setExercisePage] = useState(1);
  const { data: exerciseData, loading: exerciseLoading } = useRequest(
    () =>
      getExerciseRecords(patientId, {
        offset: (exercisePage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, exercisePage] },
  );

  const medItems = medData?.items ?? [];
  const dietItems = dietData?.items ?? [];
  const exerciseItems = exerciseData?.items ?? [];

  // 健康指标记录（保持 ProTable）
  const healthMetricColumns: ProColumns<HealthMetricItem>[] = [
    { title: '收缩压', dataIndex: 'systolic_pressure', width: 100 },
    { title: '舒张压', dataIndex: 'diastolic_pressure', width: 100 },
    { title: '血糖', dataIndex: 'blood_glucose', width: 80 },
    {
      title: '血糖状态',
      dataIndex: 'blood_glucose_status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.blood_glucose_status === '空腹' ? 'blue' : 'orange'}>
          {record.blood_glucose_status}
        </Tag>
      ),
    },
    { title: '总胆固醇', dataIndex: 'total_cholesterol', width: 100 },
    { title: '甘油三酯', dataIndex: 'triglycerides', width: 100 },
    { title: 'HDL', dataIndex: 'hdl', width: 80 },
    { title: 'LDL', dataIndex: 'ldl', width: 80 },
    {
      title: '测量时间',
      dataIndex: 'measured_at',
      width: 160,
      render: (_, record) => formatDateTime(record.measured_at),
    },
  ];

  const fetchHealthMetrics = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getHealthMetrics(patientId, {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  // 认知训练记录（保持 ProTable，mock 数据）
  const cognitiveTrainingColumns: ProColumns<CognitiveTrainingRecord>[] = [
    { title: '训练时间', dataIndex: 'trainingTime', width: 100 },
    { title: '训练时长', dataIndex: 'trainingDuration', width: 120 },
    { title: '关卡名称', dataIndex: 'cardName', width: 100 },
    { title: '关卡分数', dataIndex: 'cardCount', width: 100 },
    { title: '次数', dataIndex: 'times', width: 80 },
    { title: '关卡等级', dataIndex: 'level', width: 100 },
    {
      title: '是否完成',
      dataIndex: 'completionStatus',
      width: 100,
      render: (_, record) =>
        record.completionStatus === 1 ? (
          <Tag color="blue">已完成</Tag>
        ) : (
          <Tag color="red">未完成</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button type="link" size="small" icon={<EyeOutlined />}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 用药记录 → List */}
      <Title level={5}>用药记录</Title>
      <Spin spinning={medLoading}>
        {medItems.length > 0 ? (
          <>
            <List<MedicationRecordItem>
              dataSource={medItems}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                      item.medicine_image_url ? (
                        <Avatar
                          src={getStaticUrl(item.medicine_image_url)}
                          shape="square"
                          size={48}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : undefined
                    }
                    title={item.medicine_name}
                    description={
                      <Text type="secondary">
                        {formatDateTime(item.taken_at)} ·{' '}
                        {item.quantity ?? '--'}
                        {item.unit ?? ''}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
            {(medData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end" style={{ marginTop: 8 }}>
                <Pagination
                  size="small"
                  current={medPage}
                  pageSize={PAGE_SIZE}
                  total={medData?.total ?? 0}
                  onChange={setMedPage}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无用药记录" />
        )}
      </Spin>

      {/* 健康指标记录（保持 ProTable） */}
      <Title level={5} style={{ marginTop: 24 }}>
        健康指标记录
      </Title>
      <ProTable<HealthMetricItem>
        actionRef={healthMetricTableRef}
        rowKey="id"
        search={false}
        options={false}
        request={fetchHealthMetrics}
        columns={healthMetricColumns}
        pagination={{ defaultPageSize: 5 }}
        scroll={{ x: 900 }}
      />

      {/* 饮食记录 → 图片卡片网格 */}
      <Title level={5} style={{ marginTop: 24 }}>
        饮食记录
      </Title>
      <Spin spinning={dietLoading}>
        {dietItems.length > 0 ? (
          <>
            <Image.PreviewGroup>
              <List<DietRecordItem>
                grid={{ gutter: 16, column: 4 }}
                dataSource={dietItems}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      cover={
                        item.image_url ? (
                          <Image
                            src={getStaticUrl(item.image_url)}
                            alt={`${item.meal_date} ${MEAL_TYPE_MAP[item.meal_type] ?? item.meal_type}`}
                            width="100%"
                            height={120}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Flex
                            align="center"
                            justify="center"
                            style={{
                              height: 120,
                              background: 'var(--ant-color-bg-layout)',
                            }}
                          >
                            <Text type="secondary">暂无图片</Text>
                          </Flex>
                        )
                      }
                      styles={{ body: { padding: '8px 12px' } }}
                    >
                      <Text>{item.meal_date}</Text>
                      <br />
                      <Tag>
                        {MEAL_TYPE_MAP[item.meal_type] ?? item.meal_type}
                      </Tag>
                    </Card>
                  </List.Item>
                )}
              />
            </Image.PreviewGroup>
            {(dietData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end" style={{ marginTop: 8 }}>
                <Pagination
                  size="small"
                  current={dietPage}
                  pageSize={PAGE_SIZE}
                  total={dietData?.total ?? 0}
                  onChange={setDietPage}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无饮食记录" />
        )}
      </Spin>

      {/* 运动记录 → List */}
      <Title level={5} style={{ marginTop: 24 }}>
        运动记录
      </Title>
      <Spin spinning={exerciseLoading}>
        {exerciseItems.length > 0 ? (
          <>
            <List<ExerciseRecordItem>
              dataSource={exerciseItems}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={item.activity_name}
                    description={
                      <Text type="secondary">
                        {item.quantity} {item.unit} ·{' '}
                        {formatDateTime(item.exercised_at)}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
            {(exerciseData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end" style={{ marginTop: 8 }}>
                <Pagination
                  size="small"
                  current={exercisePage}
                  pageSize={PAGE_SIZE}
                  total={exerciseData?.total ?? 0}
                  onChange={setExercisePage}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无运动记录" />
        )}
      </Spin>

      {/* 认知训练记录（保持 ProTable，mock 数据） */}
      <Title level={5} style={{ marginTop: 24 }}>
        认知训练记录
      </Title>
      <ProTable<CognitiveTrainingRecord>
        rowKey="id"
        search={false}
        options={false}
        request={async () => ({
          data: MOCK_COGNITIVE_TRAINING_RECORDS,
          success: true,
          total: MOCK_COGNITIVE_TRAINING_RECORDS.length,
        })}
        columns={cognitiveTrainingColumns}
        pagination={{ defaultPageSize: 5 }}
      />
    </div>
  );
};

export default TodaySituation;
