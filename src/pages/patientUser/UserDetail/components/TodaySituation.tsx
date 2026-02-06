import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Image, Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import {
  getDietRecords,
  getExerciseRecords,
  getMedicationRecords,
} from '@/services/patient-user';
import type {
  DietRecordItem,
  ExerciseRecordItem,
  MedicationRecordItem,
} from '@/services/patient-user/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';
import useComponentStyles from './components.style';

const { Title, Text } = Typography;

// -------- 暂无 API 的本地类型（保留 mock） --------
interface BehaviorRecord {
  id: string;
  behaviorDetail: string;
  status: number;
}

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

interface TodaySituationProps {
  patientId: string;
}

const MEAL_TYPE_MAP: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

const TodaySituation: React.FC<TodaySituationProps> = ({ patientId }) => {
  const { styles } = useComponentStyles();
  const medicationTableRef = useRef<ActionType>(null);
  const behaviorTableRef = useRef<ActionType>(null);
  const dietTableRef = useRef<ActionType>(null);
  const exerciseTableRef = useRef<ActionType>(null);
  const cognitiveTrainingTableRef = useRef<ActionType>(null);

  // -------- Mock data（暂无 API）--------
  const getBehaviorRecords = (): BehaviorRecord[] => [
    { id: '1', behaviorDetail: '晚上11点前睡觉', status: 1 },
    { id: '2', behaviorDetail: '不抽烟', status: 1 },
  ];

  const getCognitiveTrainingRecords = (): CognitiveTrainingRecord[] => [
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

  // -------- 用药记录（真实 API） --------
  const medicationColumns: ProColumns<MedicationRecordItem>[] = [
    { title: '药品名称', dataIndex: 'medicine_name', width: 120 },
    {
      title: '药品图片',
      dataIndex: 'medicine_image_url',
      width: 80,
      render: (_, record) =>
        record.medicine_image_url ? (
          <Image
            src={getStaticUrl(record.medicine_image_url)}
            width={40}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              background: '#f0f0f0',
              borderRadius: 4,
            }}
          />
        ),
    },
    {
      title: '服用时间',
      dataIndex: 'taken_at',
      width: 160,
      render: (_, record) => formatDateTime(record.taken_at),
    },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单位', dataIndex: 'unit', width: 80 },
  ];

  const fetchMedicationRecords = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getMedicationRecords(patientId, {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  // -------- 饮食记录（真实 API） --------
  const dietColumns: ProColumns<DietRecordItem>[] = [
    { title: '日期', dataIndex: 'meal_date', width: 120 },
    {
      title: '餐次',
      dataIndex: 'meal_type',
      width: 80,
      render: (_, record) =>
        MEAL_TYPE_MAP[record.meal_type] ?? record.meal_type,
    },
    {
      title: '图片',
      dataIndex: 'image_url',
      width: 80,
      render: (_, record) =>
        record.image_url ? (
          <Image
            src={getStaticUrl(record.image_url)}
            width={40}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              background: '#f0f0f0',
              borderRadius: 4,
            }}
          />
        ),
    },
  ];

  const fetchDietRecords = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getDietRecords(patientId, {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  // -------- 运动记录（真实 API） --------
  const exerciseColumns: ProColumns<ExerciseRecordItem>[] = [
    { title: '运动项目', dataIndex: 'activity_name', width: 150 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单位', dataIndex: 'unit', width: 80 },
    {
      title: '运动时间',
      dataIndex: 'exercised_at',
      width: 160,
      render: (_, record) => formatDateTime(record.exercised_at),
    },
  ];

  const fetchExerciseRecords = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    try {
      const { data } = await getExerciseRecords(patientId, {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  // -------- 行为记录（mock）--------
  const behaviorColumns: ProColumns<BehaviorRecord>[] = [
    { title: '行为细则', dataIndex: 'behaviorDetail', width: 300 },
    {
      title: '状态',
      key: 'action',
      width: 100,
      render: (_, record) =>
        record.status === 1 ? (
          <Text className={styles.completeStatus}>
            <CheckCircleOutlined /> 完成
          </Text>
        ) : (
          <Text className={styles.uncompleteStatus}>
            <CloseCircleOutlined /> 未完成
          </Text>
        ),
    },
  ];

  // -------- 认知训练记录（mock）--------
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

  const proTableOptions = false;

  return (
    <div className={styles.tabContent}>
      {/* 用药记录（真实 API） */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            用药记录
          </Title>
        </div>
        <ProTable<MedicationRecordItem>
          actionRef={medicationTableRef}
          rowKey="id"
          search={false}
          options={proTableOptions}
          request={fetchMedicationRecords}
          columns={medicationColumns}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>

      {/* 行为记录（mock） */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            行为记录
          </Title>
        </div>
        <ProTable<BehaviorRecord>
          actionRef={behaviorTableRef}
          rowKey="id"
          search={false}
          options={proTableOptions}
          request={async () => ({
            data: getBehaviorRecords(),
            success: true,
            total: getBehaviorRecords().length,
          })}
          columns={behaviorColumns}
          pagination={false}
        />
      </div>

      {/* 饮食记录（真实 API） */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            饮食记录
          </Title>
        </div>
        <ProTable<DietRecordItem>
          actionRef={dietTableRef}
          rowKey="id"
          search={false}
          options={proTableOptions}
          request={fetchDietRecords}
          columns={dietColumns}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>

      {/* 运动记录（真实 API） */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            运动记录
          </Title>
        </div>
        <ProTable<ExerciseRecordItem>
          actionRef={exerciseTableRef}
          rowKey="id"
          search={false}
          options={proTableOptions}
          request={fetchExerciseRecords}
          columns={exerciseColumns}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>

      {/* 认知训练记录（mock） */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            认知训练记录
          </Title>
        </div>
        <ProTable<CognitiveTrainingRecord>
          actionRef={cognitiveTrainingTableRef}
          rowKey="id"
          search={false}
          options={proTableOptions}
          request={async () => ({
            data: getCognitiveTrainingRecords(),
            success: true,
            total: getCognitiveTrainingRecords().length,
          })}
          columns={cognitiveTrainingColumns}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default TodaySituation;
