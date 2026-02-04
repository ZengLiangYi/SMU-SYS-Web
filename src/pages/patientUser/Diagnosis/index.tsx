import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Divider, Input, message } from 'antd';
import React, { useState } from 'react';
import { PatientAvatarInfoContent } from '@/components';
import { CROWD_CATEGORY } from '../../../utils/constants';
import {
  AICheckRecommendation,
  AIDiagnosisClassification,
  ComprehensivePrescription,
  InitialDiagnosis,
  TestResultEntry,
} from './components';

import './index.less';

const Diagnosis: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    chiefComplaint:
      '患者自述近半年来记忆力明显下降，经常忘记刚发生的事情，偶尔找不到回家的路。睡眠质量一般，情绪稍显低落。',
    appearance: '',
    currentHistory:
      '患者5年前确诊高血压，规律服药。无脑外伤史，无重大手术史。家族中有一位叔叔曾有阿尔茨海默病。',
  });

  // AI检查项目推荐
  const [checkItems, setCheckItems] = useState({
    scaleAssessment: [
      { id: '1', name: 'AD-8（早期筛查）', checked: true },
      { id: '2', name: 'MMSE（简易精神状态）', checked: true },
      { id: '3', name: 'MoCA（蒙特利尔）', checked: false },
    ],
    laboratoryTest: [
      { id: '1', name: '维生素B12', checked: true },
      { id: '2', name: '甲状腺功能（TSH）', checked: true },
      { id: '3', name: '同型半胱氨酸（Hcy）', checked: true },
    ],
    imagingTest: [
      { id: '1', name: '头颅 MRI', checked: true },
      { id: '2', name: 'PET-CT (Aβ显像)', checked: false },
    ],
  });

  const aiSuggestion =
    '基于《中国认知功能社区筛查及管理指南(2025版)》第3章第2节，建议优先完成基础量表评估（AD-8、MMSE）以快速判断认知功能状态。同步进行实验室筛查（维生素B12、甲状腺功能、同型半胱氨酸）排除可逆性病因。若量表评估提示认知障碍，再进行头颅MRI检查明确脑结构改变。考虑患者家族史阳性，建议后续可考虑PET-CT进一步评估Aβ沉积情况。';

  // 患者档案信息
  const [patientArchive, setPatientArchive] = useState({
    familyHistory: '无',
    existingDisease: '无',
    existingMedication: '降压药',
  });

  const [isEditingArchive, setIsEditingArchive] = useState(false);

  // 模拟患者信息
  const patientInfo = {
    name: '胡超',
    gender: 'male',
    age: 78,
    phone: '19829548475',
    category: CROWD_CATEGORY.MCI_CONTROL,
  };

  const steps = [
    { title: '初诊' },
    { title: 'AI检查项目推荐' },
    { title: '检测结果录入' },
    { title: 'AI认知障碍分类诊断' },
    { title: '综合康复处方制定' },
  ];

  // 诊断确认状态
  const [diagnosisConfirmed, setDiagnosisConfirmed] = useState(false);

  const handleNext = () => {
    if (current === 0) {
      // 验证第一步表单
      if (!formData.chiefComplaint.trim()) {
        message.warning('请填写主诉');
        return;
      }
      if (!formData.currentHistory.trim()) {
        message.warning('请填写现病史');
        return;
      }
    }
    if (current === 1) {
      // 验证第二步至少选择一项检查
      const hasSelected =
        checkItems.scaleAssessment.some((item) => item.checked) ||
        checkItems.laboratoryTest.some((item) => item.checked) ||
        checkItems.imagingTest.some((item) => item.checked);
      if (!hasSelected) {
        message.warning('请至少选择一项检查项目');
        return;
      }
    }
    if (current === 3) {
      // 验证第四步必须确认诊断
      if (!diagnosisConfirmed) {
        message.warning('请先确认诊断结果');
        return;
      }
    }
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    }
  };

  // 切换检查项目选中状态
  const handleCheckItemToggle = (category: string, id: string) => {
    setCheckItems((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    }));
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleClose = () => {
    history.back();
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (current) {
      case 0:
        return <InitialDiagnosis formData={formData} onChange={setFormData} />;
      case 1:
        return (
          <AICheckRecommendation
            checkItems={checkItems}
            aiSuggestion={aiSuggestion}
            onCheckItemToggle={handleCheckItemToggle}
          />
        );
      case 2:
        return <TestResultEntry checkItems={checkItems} />;
      case 3:
        return (
          <AIDiagnosisClassification
            onConfirm={handleDiagnosisConfirm}
            confirmed={diagnosisConfirmed}
          />
        );
      case 4:
        return (
          <ComprehensivePrescription onComplete={handlePrescriptionComplete} />
        );
      default:
        return null;
    }
  };

  // 确认诊断
  const handleDiagnosisConfirm = () => {
    setDiagnosisConfirmed(true);
    message.success('诊断确认成功！可以进入下一步制定康复处方');
  };

  // 完成处方制定
  const handlePrescriptionComplete = () => {
    message.success('康复处方制定完成！');
    // TODO: 保存数据并跳转
  };

  return (
    <PageContainer title={false} className="diagnosis-page">
      <div className="diagnosis-container">
        {/* 头部 */}
        <div className="diagnosis-header">
          <h2 className="diagnosis-title">诊断-{steps[current].title}</h2>
          <div className="header-actions">
            <Button type="primary" danger onClick={handleClose}>
              离开
            </Button>
            <Button onClick={handlePrev} disabled={current === 0}>
              上一步
            </Button>
            {current < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => message.success('诊断流程完成！')}
              >
                完成诊断
              </Button>
            )}
          </div>
        </div>

        {/* 患者信息卡片和档案 - 左右布局（所有步骤共用）*/}
        <div className="patient-info-wrapper">
          <div className="patient-info-left">
            <PatientAvatarInfoContent
              name={patientInfo.name}
              gender={patientInfo.gender}
              age={patientInfo.age}
              phone={patientInfo.phone}
              category={patientInfo.category}
            />
          </div>

          <Divider vertical style={{ height: 'none' }} />

          <div className="patient-info-right">
            <div className="patient-archive-section">
              <div className="archive-grid">
                <div className="archive-item">
                  <div className="archive-label">家族史:</div>
                  {isEditingArchive ? (
                    <Input
                      value={patientArchive.familyHistory}
                      onChange={(e) =>
                        setPatientArchive({
                          ...patientArchive,
                          familyHistory: e.target.value,
                        })
                      }
                      placeholder="请输入家族史"
                    />
                  ) : (
                    <div className="archive-value">
                      {patientArchive.familyHistory}
                    </div>
                  )}
                </div>

                <div className="archive-item">
                  <div className="archive-label">既往病史:</div>
                  {isEditingArchive ? (
                    <Input
                      value={patientArchive.existingDisease}
                      onChange={(e) =>
                        setPatientArchive({
                          ...patientArchive,
                          existingDisease: e.target.value,
                        })
                      }
                      placeholder="请输入既往病史"
                    />
                  ) : (
                    <div className="archive-value">
                      {patientArchive.existingDisease}
                    </div>
                  )}
                </div>

                <div className="archive-item">
                  <div className="archive-label">既往用药:</div>
                  {isEditingArchive ? (
                    <Input
                      value={patientArchive.existingMedication}
                      onChange={(e) =>
                        setPatientArchive({
                          ...patientArchive,
                          existingMedication: e.target.value,
                        })
                      }
                      placeholder="请输入既往用药"
                    />
                  ) : (
                    <div className="archive-value">
                      {patientArchive.existingMedication}
                    </div>
                  )}
                </div>
              </div>
              <div className="archive-header">
                {!isEditingArchive ? (
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditingArchive(true)}
                  />
                ) : (
                  <div className="archive-actions">
                    <Button
                      type="link"
                      icon={<SaveOutlined />}
                      onClick={() => {
                        setIsEditingArchive(false);
                        message.success('保存成功');
                      }}
                    />
                    <Button
                      type="link"
                      onClick={() => setIsEditingArchive(false)}
                    >
                      <CloseOutlined />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 步骤内容 */}
        {renderStepContent()}
      </div>
    </PageContainer>
  );
};

export default Diagnosis;
