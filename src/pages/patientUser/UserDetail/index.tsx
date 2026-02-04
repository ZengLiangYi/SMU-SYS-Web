import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Flex, Space, Tabs, Typography } from 'antd';
import React, { useState } from 'react';
import { PatientAvatarInfoContent } from '@/components';
import type { UserDetailInfo } from '@/services/patient-user/typings';
import { CROWD_CATEGORY, getTimeFormat } from '@/utils/constants';
import {
  DiagnosisRecord,
  EffectEvaluation,
  HealthRecoveryPlan,
  PersonalInfo,
  RehabilitationHistory,
  TodaySituation,
  TransferRecord,
} from './components';
import useStyles from './index.style';

const { Title, Text } = Typography;

const UserDetail: React.FC = () => {
  const { styles } = useStyles();
  const [activeTab, setActiveTab] = useState<string>('personalInfo');

  // 模拟用户数据
  const userInfo: UserDetailInfo = {
    id: '1',
    name: '胡超',
    gender: 'male',
    age: 78,
    phone: '19829548475',
    category: CROWD_CATEGORY.MCI_CONTROL,
    birthday: '1900-01-01',
    drinkingHabit: '清淡少盐',
    familyHistory: '无',
    existingDisease: '高血压、糖尿病',
    occupation: '工人',
    province: '广东省深圳市',
    notDrugAllergy: '无',
    lifeHabit: '干净卫生',
    educationLevel: '大学',
    existingMedication: '降压药',
    randomIntention: '愿意',
    address: '广东省深圳市前海湾1号',
    emergencyContactName: '胡小王',
    emergencyContactRelation: '儿子',
    emergencyContactPhone: '13966661111',
    AIComprehensiveEfficacyEvaluationSuggestion: '暂无',
    diagnosisScore: 99,
    diagnosisScoreUpdateTime: '2026-01-22 10:00:00',
  };

  const tabItems = [
    {
      key: 'personalInfo',
      label: '个人信息',
      children: <PersonalInfo userInfo={userInfo} />,
    },
    {
      key: 'transferRecord',
      label: '转诊记录',
      children: <TransferRecord />,
    },
    {
      key: 'diagnosisRecord',
      label: '诊疗记录',
      children: <DiagnosisRecord />,
    },
    {
      key: 'effectEvaluation',
      label: '疗效评估',
      children: (
        <EffectEvaluation
          aiSuggestion={userInfo.AIComprehensiveEfficacyEvaluationSuggestion}
        />
      ),
    },
    {
      key: 'healthRecoveryPlan',
      label: '当前康复处方',
      children: <HealthRecoveryPlan />,
    },
    {
      key: 'rehabilitationHistory',
      label: '康复评分历史',
      children: <RehabilitationHistory />,
    },
    {
      key: 'todaySituation',
      label: '今日情况',
      children: <TodaySituation />,
    },
  ];

  const handleDiagnosis = () => {
    history.push(`/patient-user/diagnosis?id=${userInfo.id}`);
  };

  return (
    <PageContainer title={false}>
      <Card className={styles.userDetailCard}>
        {/* 页面头部 */}
        <Flex
          justify="space-between"
          align="center"
          className={styles.userDetailHeader}
        >
          <Title level={4} className={styles.pageTitle}>
            个人信息
          </Title>
          <Space>
            <Button
              style={{
                background: '#4ea8ff',
                borderColor: '#279cea',
                color: '#fff',
              }}
            >
              随访
            </Button>
            <Button
              style={{
                background: '#ff5340',
                borderColor: '#e12f0f',
                color: '#fff',
              }}
            >
              转诊
            </Button>
            <Button
              style={{
                background: '#61e054',
                borderColor: '#4ec731',
                color: '#fff',
              }}
              onClick={handleDiagnosis}
            >
              诊断
            </Button>
          </Space>
        </Flex>

        {/* 用户基本信息 */}
        <div className={styles.userBasicInfo}>
          <Text className={styles.aiSuggestion}>
            AI综合疗效评估建议：
            {userInfo.AIComprehensiveEfficacyEvaluationSuggestion}
          </Text>
          <Flex
            justify="space-between"
            gap={24}
            className={styles.userInfoContainer}
          >
            <div className={styles.userInfoLeft}>
              <PatientAvatarInfoContent {...userInfo} />
            </div>
            <div className={styles.userDiagnosisScore}>
              <div className={styles.scoreValue}>{userInfo.diagnosisScore}</div>
              <div className={styles.scoreLabel}>当前疗效评分是</div>
              <div className={styles.scoreUpdateTime}>
                {getTimeFormat(userInfo.diagnosisScoreUpdateTime)}更新
              </div>
            </div>
          </Flex>
        </div>

        {/* Tab 区域 */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ padding: '0 24px' }}
        />
      </Card>
    </PageContainer>
  );
};

export default UserDetail;
