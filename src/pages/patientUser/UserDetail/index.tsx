import { PageContainer } from '@ant-design/pro-components';
import { history, useModel, useRequest, useSearchParams } from '@umijs/max';
import {
  App,
  Button,
  Card,
  Empty,
  Flex,
  Space,
  Spin,
  Tabs,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { PatientAvatarInfoContent } from '@/components';
import { createBindRequest } from '@/services/bind-request';
import { getPatient } from '@/services/patient-user';
import { formatDateTime } from '@/utils/date';
import DiagnosisRecord from './components/DiagnosisRecord';
import EffectEvaluation from './components/EffectEvaluation';
import HealthRecoveryPlan from './components/HealthRecoveryPlan';
import PersonalInfo from './components/PersonalInfo';
import RehabilitationHistory from './components/RehabilitationHistory';
import TodaySituation from './components/TodaySituation';
import TransferRecord from './components/TransferRecord';
import useStyles from './index.style';

const { Title, Text } = Typography;

const UserDetail: React.FC = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id') ?? '';
  const [activeTab, setActiveTab] = useState<string>('personalInfo');

  // -------- 获取患者详情 --------
  const {
    data: patientDetail,
    loading,
    refresh,
  } = useRequest(() => getPatient(patientId), {
    ready: !!patientId,
    refreshDeps: [patientId],
  });

  // -------- 绑定请求 --------
  const { run: runBind, loading: bindLoading } = useRequest(createBindRequest, {
    manual: true,
    onSuccess: () => {
      message.success('绑定请求已发送，等待患者确认…');
    },
  });

  // -------- 绑定状态判断 --------
  const isBound = patientDetail?.doctor_id === initialState?.currentUser?.id;
  const isUnbound = !patientDetail?.doctor_id;

  const handleBind = () => {
    if (!patientId) return;
    runBind({ patient_id: patientId });
  };

  const handleDiagnosis = () => {
    history.push(`/patient-user/diagnosis?id=${patientId}`);
  };

  if (!patientId) {
    return (
      <PageContainer title={false}>
        <Empty description="未指定患者 ID" />
      </PageContainer>
    );
  }

  if (loading || !patientDetail) {
    return (
      <PageContainer title={false}>
        <Card>
          <Spin
            style={{ display: 'block', padding: 80, textAlign: 'center' }}
          />
        </Card>
      </PageContainer>
    );
  }

  const tabItems = [
    {
      key: 'personalInfo',
      label: '个人信息',
      children: (
        <PersonalInfo
          patientId={patientId}
          patientDetail={patientDetail}
          onSaved={refresh}
        />
      ),
    },
    {
      key: 'transferRecord',
      label: '转诊记录',
      children: <TransferRecord patientId={patientId} />,
    },
    {
      key: 'diagnosisRecord',
      label: '诊疗记录',
      children: <DiagnosisRecord />,
    },
    {
      key: 'effectEvaluation',
      label: '疗效评估',
      children: <EffectEvaluation aiSuggestion="暂无" />,
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
      children: <TodaySituation patientId={patientId} />,
    },
  ];

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
            {/* 未绑定：显示绑定按钮 */}
            {isUnbound && (
              <Button type="primary" loading={bindLoading} onClick={handleBind}>
                发起绑定
              </Button>
            )}
            {/* 已绑定到当前医生：显示操作按钮 */}
            {isBound && (
              <>
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
              </>
            )}
          </Space>
        </Flex>

        {/* 用户基本信息 */}
        <div className={styles.userBasicInfo}>
          <Text className={styles.aiSuggestion}>AI综合疗效评估建议：暂无</Text>
          <Flex
            justify="space-between"
            gap={24}
            className={styles.userInfoContainer}
          >
            <div className={styles.userInfoLeft}>
              <PatientAvatarInfoContent
                name={patientDetail.name}
                gender={patientDetail.gender}
                age={patientDetail.age}
                phone={patientDetail.phone}
                categories={patientDetail.categories}
              />
            </div>
            <div className={styles.userDiagnosisScore}>
              <div className={styles.scoreValue}>--</div>
              <div className={styles.scoreLabel}>当前疗效评分是</div>
              <div className={styles.scoreUpdateTime}>
                {formatDateTime(new Date().toISOString())}更新
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
