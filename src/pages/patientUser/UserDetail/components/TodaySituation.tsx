import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import type {
  BehaviorRecord,
  CognitiveTrainingRecord,
  DietRecord,
  ExerciseRecord,
  MedicationRecord,
} from '@/services/patient-user/typings';
import useComponentStyles from './components.style';

const { Title, Text } = Typography;

const TodaySituation: React.FC = () => {
  const { styles } = useComponentStyles();
  const medicationTableRef = useRef<ActionType>(null);
  const behaviorTableRef = useRef<ActionType>(null);
  const dietTableRef = useRef<ActionType>(null);
  const exerciseTableRef = useRef<ActionType>(null);
  const cognitiveTrainingTableRef = useRef<ActionType>(null);

  // Mock data functions
  const getMedicationRecords = (): MedicationRecord[] => {
    return [
      {
        id: '1',
        medicineName: '降压药',
        medicineImage: '',
        usageTime: '06:44',
        dosage: 1,
        unit: '粒',
        status: 1,
      },
      {
        id: '2',
        medicineName: '降压药',
        medicineImage: '',
        usageTime: '20:34',
        dosage: 1,
        unit: '粒',
        status: 1,
      },
      {
        id: '3',
        medicineName: '降压药',
        medicineImage: '',
        usageTime: '22:30',
        dosage: 1,
        unit: '粒',
        status: 1,
      },
      {
        id: '4',
        medicineName: '降压药',
        medicineImage: '',
        usageTime: '07:48',
        dosage: 1,
        unit: '粒',
        status: 1,
      },
      {
        id: '5',
        medicineName: '降压药',
        medicineImage: '',
        usageTime: '03:57',
        dosage: 1,
        unit: '粒',
        status: 1,
      },
    ];
  };

  const getBehaviorRecords = (): BehaviorRecord[] => {
    return [
      { id: '1', behaviorDetail: '晚上11点前睡觉', status: 1 },
      { id: '2', behaviorDetail: '不抽烟', status: 1 },
    ];
  };

  const getDietRecords = (): DietRecord[] => {
    return [
      { id: '1', time: '18:38', image: '', note: '早餐' },
      { id: '2', time: '18:03', image: '', note: '中餐' },
      { id: '3', time: '11:27', image: '', note: '晚餐' },
    ];
  };

  const getExerciseRecords = (): ExerciseRecord[] => {
    return [{ id: '1', behaviorDetail: '跑步15分钟', status: 1 }];
  };

  const getCognitiveTrainingRecords = (): CognitiveTrainingRecord[] => {
    return [
      {
        id: '1',
        trainingTime: '11:57',
        trainingDuration: '18时43分',
        cardName: '第一关',
        cardImage: '',
        cardCount: 99,
        times: 5,
        level: 1,
        completionStatus: 1,
      },
      {
        id: '2',
        trainingTime: '12:32',
        trainingDuration: '07时18分',
        cardName: '第一关',
        cardImage: '',
        cardCount: 99,
        times: 4,
        level: 1,
        completionStatus: 1,
      },
      {
        id: '3',
        trainingTime: '07:04',
        trainingDuration: '19时59分',
        cardName: '第一关',
        cardImage: '',
        cardCount: 99,
        times: 3,
        level: 1,
        completionStatus: 1,
      },
      {
        id: '4',
        trainingTime: '22:24',
        trainingDuration: '21时22分',
        cardName: '第一关',
        cardImage: '',
        cardCount: 99,
        times: 2,
        level: 1,
        completionStatus: 1,
      },
      {
        id: '5',
        trainingTime: '05:23',
        trainingDuration: '07时10分',
        cardName: '第一关',
        cardImage: '',
        cardCount: 99,
        times: 1,
        level: 1,
        completionStatus: 1,
      },
    ];
  };

  // Columns definitions
  const medicationColumns: ProColumns<MedicationRecord>[] = [
    { title: '药品名称', dataIndex: 'medicineName', width: 120 },
    {
      title: '药品图片',
      dataIndex: 'medicineImage',
      width: 100,
      render: () => (
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
    { title: '用药时间', dataIndex: 'usageTime', width: 100 },
    { title: '药品数量', dataIndex: 'dosage', width: 100 },
    { title: '药品单位', dataIndex: 'unit', width: 100 },
    {
      title: '按钮',
      key: 'action',
      width: 100,
      render: (_, record) =>
        record.status === 1 ? (
          <Text className={styles.completeStatus}>
            <CheckCircleOutlined />
            完成
          </Text>
        ) : (
          <Text className={styles.uncompleteStatus}>
            <CloseCircleOutlined />
            未完成
          </Text>
        ),
    },
  ];

  const behaviorColumns: ProColumns<BehaviorRecord>[] = [
    { title: '行为细则', dataIndex: 'behaviorDetail', width: 300 },
    {
      title: '按钮',
      key: 'action',
      width: 100,
      render: (_, record) =>
        record.status === 1 ? (
          <Text className={styles.completeStatus}>
            <CheckCircleOutlined />
            完成
          </Text>
        ) : (
          <Text className={styles.uncompleteStatus}>
            <CloseCircleOutlined />
            未完成
          </Text>
        ),
    },
  ];

  const dietColumns: ProColumns<DietRecord>[] = [
    { title: '时间', dataIndex: 'time', width: 120 },
    {
      title: '图片',
      dataIndex: 'image',
      width: 100,
      render: () => (
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
    { title: '备注', dataIndex: 'note', width: 200 },
  ];

  const exerciseColumns: ProColumns<ExerciseRecord>[] = [
    { title: '行为细则', dataIndex: 'behaviorDetail', width: 300 },
    {
      title: '按钮',
      key: 'action',
      width: 100,
      render: (_, record) =>
        record.status === 1 ? (
          <Text className={styles.completeStatus}>
            <CheckCircleOutlined />
            完成
          </Text>
        ) : (
          <Text className={styles.uncompleteStatus}>
            <CloseCircleOutlined />
            未完成
          </Text>
        ),
    },
  ];

  const cognitiveTrainingColumns: ProColumns<CognitiveTrainingRecord>[] = [
    { title: '训练时间', dataIndex: 'trainingTime', width: 100 },
    { title: '训练时长', dataIndex: 'trainingDuration', width: 120 },
    { title: '关卡名称', dataIndex: 'cardName', width: 100 },
    {
      title: '关卡图片',
      dataIndex: 'cardImage',
      width: 100,
      render: () => (
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
      title: '按钮',
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
    <div className={styles.tabContent}>
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            用药记录
          </Title>
        </div>
        <ProTable<MedicationRecord>
          actionRef={medicationTableRef}
          rowKey="id"
          search={false}
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          request={async () => ({
            data: getMedicationRecords(),
            success: true,
            total: getMedicationRecords().length,
          })}
          columns={medicationColumns}
          pagination={false}
        />
      </div>

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
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          request={async () => ({
            data: getBehaviorRecords(),
            success: true,
            total: getBehaviorRecords().length,
          })}
          columns={behaviorColumns}
          pagination={false}
        />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            饮食记录
          </Title>
        </div>
        <ProTable<DietRecord>
          actionRef={dietTableRef}
          rowKey="id"
          search={false}
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          request={async () => ({
            data: getDietRecords(),
            success: true,
            total: getDietRecords().length,
          })}
          columns={dietColumns}
          pagination={false}
        />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            运动记录
          </Title>
        </div>
        <ProTable<ExerciseRecord>
          actionRef={exerciseTableRef}
          rowKey="id"
          search={false}
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          request={async () => ({
            data: getExerciseRecords(),
            success: true,
            total: getExerciseRecords().length,
          })}
          columns={exerciseColumns}
          pagination={false}
        />
      </div>

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
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          request={async () => ({
            data: getCognitiveTrainingRecords(),
            success: true,
            total: getCognitiveTrainingRecords().length,
          })}
          columns={cognitiveTrainingColumns}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default TodaySituation;
