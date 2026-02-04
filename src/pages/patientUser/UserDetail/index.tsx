import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import React, { useState } from 'react';
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
import './index.less';
import { history } from '@umijs/max';
import { PatientAvatarInfoContent } from '@/components';

const UserDetail: React.FC = () => {
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
    <PageContainer title={false} className="user-detail-page">
      <div className="user-detail-card">
        <div className="user-detail-header">
          <h2 className="page-title">个人信息</h2>
          <div className="header-actions">
            <button type="button" className="action-btn visit-btn">
              随访
            </button>
            <button type="button" className="action-btn transfer-btn">
              转诊
            </button>
            <button
              type="button"
              className="action-btn diagnosis-btn"
              onClick={handleDiagnosis}
            >
              诊断
            </button>
          </div>
        </div>

        <div className="user-basic-info">
          <div className="ai-comprehensive-efficacy-evaluation-suggestion">
            AI综合疗效评估建议：
            {userInfo.AIComprehensiveEfficacyEvaluationSuggestion}
          </div>
          <div className="user-info-container">
            <div className="user-info-left">
              <PatientAvatarInfoContent {...userInfo} />
            </div>
            <div className="user-info-right">
              <div className="user-diagnosis-score">
                <div className="user-diagnosis-score-value">
                  {userInfo.diagnosisScore}
                </div>
                <div className="user-diagnosis-score-label">当前疗效评分是</div>
                <div className="user-diagnosis-score-update-time">
                  {getTimeFormat(userInfo.diagnosisScoreUpdateTime)}更新
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="user-detail-tabs"
        />
      </div>
    </PageContainer>
  );
};

export default UserDetail;
