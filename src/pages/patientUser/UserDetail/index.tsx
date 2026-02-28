import { PageContainer } from '@ant-design/pro-components';
import {
  history,
  useModel,
  useParams,
  useRequest,
  useSearchParams,
} from '@umijs/max';
import { App, Button, Empty, Flex, Space, Spin, Typography, theme } from 'antd';
import React, { Suspense, useState } from 'react';
import PatientAvatarInfoContent from '@/components/PatientAvatarInfoContent';
import { createBindRequest } from '@/services/bind-request';
import { getPatient } from '@/services/patient-user';
import { formatDateTime } from '@/utils/date';
import PersonalInfo from './components/PersonalInfo';
import TodaySituation from './components/TodaySituation';
import TransferRecord from './components/TransferRecord';

// -------- 重型组件按需加载 (bundle-dynamic-imports) --------
const DiagnosisRecord = React.lazy(
  () => import('./components/DiagnosisRecord'),
);
const EffectEvaluation = React.lazy(
  () => import('./components/EffectEvaluation'),
);
const HealthRecoveryPlan = React.lazy(
  () => import('./components/HealthRecoveryPlan'),
);
const RehabilitationHistory = React.lazy(
  () => import('./components/RehabilitationHistory'),
);
const CreateFollowupForm = React.lazy(
  () => import('./components/CreateFollowupForm'),
);
const CreateReferralForm = React.lazy(
  () => import('./components/CreateReferralForm'),
);

const { Text } = Typography;

const TAB_LIST = [
  { key: 'personalInfo', tab: '个人信息' },
  { key: 'transferRecord', tab: '转诊记录' },
  { key: 'diagnosisRecord', tab: '诊疗记录' },
  { key: 'effectEvaluation', tab: '疗效评估' },
  { key: 'healthRecoveryPlan', tab: '当前康复处方' },
  { key: 'rehabilitationHistory', tab: '康复评分历史' },
  { key: 'todaySituation', tab: '今日情况' },
];

const LazyFallback = (
  <Spin style={{ display: 'block', padding: 80, textAlign: 'center' }} />
);

const UserDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const { id: patientId = '' } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'personalInfo';
  const [followupOpen, setFollowupOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);

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
      message.success('绑定请求已发送，等待患者确认\u2026');
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

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key }, { replace: true });
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
        <Spin style={{ display: 'block', padding: 80, textAlign: 'center' }} />
      </PageContainer>
    );
  }

  // -------- Tab 内容渲染 --------
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personalInfo':
        return (
          <PersonalInfo
            patientId={patientId}
            patientDetail={patientDetail}
            onSaved={refresh}
          />
        );
      case 'transferRecord':
        return <TransferRecord patientId={patientId} />;
      case 'diagnosisRecord':
        return (
          <Suspense fallback={LazyFallback}>
            <DiagnosisRecord patientId={patientId} />
          </Suspense>
        );
      case 'effectEvaluation':
        return (
          <Suspense fallback={LazyFallback}>
            <EffectEvaluation patientId={patientId} />
          </Suspense>
        );
      case 'healthRecoveryPlan':
        return (
          <Suspense fallback={LazyFallback}>
            <HealthRecoveryPlan patientId={patientId} />
          </Suspense>
        );
      case 'rehabilitationHistory':
        return (
          <Suspense fallback={LazyFallback}>
            <RehabilitationHistory patientId={patientId} />
          </Suspense>
        );
      case 'todaySituation':
        return <TodaySituation patientId={patientId} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer
      header={{
        title: patientDetail.name,
        children: (
          <Flex justify="space-between" align="flex-start" gap={24}>
            <PatientAvatarInfoContent
              name={patientDetail.name}
              gender={patientDetail.gender}
              age={patientDetail.age}
              phone={patientDetail.phone}
              categories={patientDetail.categories}
            />
            <Flex vertical align="center" gap={4} style={{ minWidth: 120 }}>
              <Text strong style={{ fontSize: token.fontSizeHeading1 }}>
                --
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                当前疗效评分
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {formatDateTime(new Date().toISOString())}更新
              </Text>
            </Flex>
          </Flex>
        ),
        extra: (
          <Space>
            {isUnbound && (
              <Button type="primary" loading={bindLoading} onClick={handleBind}>
                发起绑定
              </Button>
            )}
            {isBound && (
              <>
                <Button type="primary" onClick={() => setFollowupOpen(true)}>
                  随访
                </Button>
                <Button danger onClick={() => setReferralOpen(true)}>
                  转诊
                </Button>
                <Button type="primary" onClick={handleDiagnosis}>
                  诊断
                </Button>
              </>
            )}
          </Space>
        ),
      }}
      tabList={TAB_LIST}
      tabActiveKey={activeTab}
      onTabChange={handleTabChange}
    >
      {renderTabContent()}

      <Suspense fallback={null}>
        <CreateFollowupForm
          patientId={patientId}
          open={followupOpen}
          onOpenChange={setFollowupOpen}
          onOk={() => setFollowupOpen(false)}
        />
        <CreateReferralForm
          patientId={patientId}
          open={referralOpen}
          onOpenChange={setReferralOpen}
          onOk={(referralType) => {
            setReferralOpen(false);
            if (referralType === 'internal') {
              history.push('/patient-user/list');
            } else {
              refresh();
            }
          }}
        />
      </Suspense>
    </PageContainer>
  );
};

export default UserDetail;
