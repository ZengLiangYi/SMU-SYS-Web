import {
  PageContainer,
  ProCard,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { App, Button, Flex, Result, Spin, Typography } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { updateInitialDiagnosis } from '@/services/diagnosis';
import type { ScreeningItems } from '@/services/diagnosis/typings.d';
import { getFileUrl, getUploadProps, urlToUploadFile } from '@/utils/upload';
import AICheckContent from './components/AICheckContent';
import AIDiagnosisContent from './components/AIDiagnosisContent';
import PatientInfoHeader from './components/PatientInfoHeader';
import type { PrescriptionDataRef } from './components/PrescriptionContent';
import PrescriptionContent from './components/PrescriptionContent';
import useDiagnosisFlow from './hooks/useDiagnosisFlow';
import useDiagnosisStyles from './index.style';

const { Text } = Typography;

const Diagnosis: React.FC = () => {
  const { styles } = useDiagnosisStyles();
  const { message } = App.useApp();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id') ?? '';

  const prescriptionRef = useRef<PrescriptionDataRef>(null);

  const {
    initialLoading,
    patientDetail,
    diagnosisData,
    initialStep,
    // 筛查
    screeningLoading,
    scaleItems,
    labItems,
    imagingItems,
    selectedScaleIds,
    selectedLabIds,
    selectedImagingIds,
    setSelectedScaleIds,
    setSelectedLabIds,
    setSelectedImagingIds,
    aiSuggestion,
    aiConfidence,
    aiExaminationSteps,
    loadScreeningData,
    // 诊断
    diagnosisLoading,
    primaryDisease,
    otherDiseases,
    preventionAdvice,
    diseaseNameMap,
    loadDiagnosisData,
    // 处方
    prescriptionLoading,
    aiPrescriptionSummary,
    initialMedications,
    initialCognitiveCards,
    initialDietContent,
    initialExercises,
    loadPrescriptionData,
  } = useDiagnosisFlow(patientId);

  // C1 FIX: controlled StepsForm
  const [currentStep, setCurrentStep] = useState(0);

  // 初始步骤加载完成后同步
  useEffect(() => {
    if (initialStep >= 0) {
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  // 疾病类型选项
  const diseaseOptions = useMemo(
    () =>
      Array.from(diseaseNameMap.entries()).map(([id, name]) => ({
        label: name,
        value: id,
      })),
    [diseaseNameMap],
  );

  // beforeunload guard
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // -------- 早返回 --------
  if (!patientId) {
    return (
      <PageContainer title={false}>
        <ProCard>未指定患者 ID</ProCard>
      </PageContainer>
    );
  }

  if (initialLoading || !patientDetail) {
    return (
      <PageContainer title={false}>
        <ProCard>
          <Spin
            style={{ display: 'block', padding: 80, textAlign: 'center' }}
          />
        </ProCard>
      </PageContainer>
    );
  }

  // 已完成的诊断
  if (initialStep === -1) {
    return (
      <PageContainer title={false}>
        <ProCard>
          <Result
            status="success"
            title="诊断已完成"
            subTitle={`完成时间：${diagnosisData?.completed_at ?? '--'}`}
            extra={[
              <Button
                key="detail"
                type="primary"
                onClick={() =>
                  history.push(`/patient-user/detail/${patientId}`)
                }
              >
                查看患者详情
              </Button>,
              <Button key="list" onClick={() => history.push('/patient-user')}>
                返回患者列表
              </Button>,
            ]}
          />
        </ProCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={false}>
      <ProCard className={styles.diagnosisContainer}>
        <PatientInfoHeader patientDetail={patientDetail} />

        <StepsForm
          current={currentStep}
          onCurrentChange={setCurrentStep}
          stepsProps={{ size: 'small', style: { marginBottom: 24 } }}
          formProps={{
            validateMessages: { required: `\${label}不能为空` },
          }}
          submitter={{
            render: (props) => {
              const { step, onPre, onSubmit } = props;
              return (
                <Flex justify="flex-end" gap={12} style={{ marginTop: 24 }}>
                  <Button type="primary" danger onClick={() => history.back()}>
                    离开
                  </Button>
                  {step > 0 ? <Button onClick={onPre}>上一步</Button> : null}
                  <Button type="primary" onClick={onSubmit}>
                    {step === 4 ? '完成诊断' : '下一步'}
                  </Button>
                </Flex>
              );
            },
          }}
          onFinish={async () => {
            try {
              const data = prescriptionRef.current?.getData();
              await updateInitialDiagnosis(patientId, {
                medicine_ids: data?.medications.map((m) => m.id) ?? [],
                rehab_level_ids: data?.cognitiveCards.map((c) => c.id) ?? [],
                exercise_plan: (data?.exercises ?? []).map((e) => ({
                  name: e.exerciseName,
                  quantity: 1,
                  unit: e.duration,
                })),
                diet_plan: data?.dietContent ?? '',
              });
              message.success('诊断流程完成');
              history.push(`/patient-user/detail/${patientId}`);
              return true;
            } catch {
              message.error('提交失败，请重试');
              return false;
            }
          }}
        >
          {/* ======== Step 0: 初诊 ======== */}
          <StepsForm.StepForm
            name="initial"
            title="初诊"
            initialValues={{
              chief_complaint: diagnosisData?.chief_complaint ?? '',
              physical_signs: diagnosisData?.physical_signs ?? '',
              present_illness: diagnosisData?.present_illness ?? '',
            }}
            onFinish={async (values) => {
              try {
                await updateInitialDiagnosis(patientId, {
                  chief_complaint: values.chief_complaint,
                  physical_signs: values.physical_signs,
                  present_illness: values.present_illness,
                });
                await loadScreeningData(
                  values.chief_complaint,
                  values.present_illness,
                  values.physical_signs ?? '',
                );
                return true;
              } catch {
                message.error('保存失败，请重试');
                return false;
              }
            }}
          >
            <ProFormTextArea
              name="chief_complaint"
              label="主诉"
              placeholder="请输入患者主诉…"
              rules={[{ required: true }]}
              fieldProps={{ rows: 3 }}
            />
            <ProFormTextArea
              name="physical_signs"
              label="体征"
              placeholder="请记录患者外在表现…"
              fieldProps={{ rows: 3 }}
            />
            <ProFormTextArea
              name="present_illness"
              label="现病史"
              placeholder="请输入现病史…"
              rules={[{ required: true }]}
              fieldProps={{ rows: 3 }}
            />
          </StepsForm.StepForm>

          {/* ======== Step 1: AI 检查推荐 ======== */}
          <StepsForm.StepForm
            name="screening"
            title="AI检查项目推荐"
            onFinish={async () => {
              const hasSelected =
                selectedScaleIds.length > 0 ||
                selectedLabIds.length > 0 ||
                selectedImagingIds.length > 0;
              if (!hasSelected) {
                message.warning('请至少选择一项检查项目');
                return false;
              }
              try {
                const screeningItemsData: ScreeningItems = {
                  selected_assessments: selectedScaleIds,
                  selected_lab_tests: selectedLabIds,
                  selected_imaging_tests: selectedImagingIds,
                };
                await updateInitialDiagnosis(patientId, {
                  screening_items: screeningItemsData,
                  examination_steps: aiExaminationSteps ?? undefined,
                });
                return true;
              } catch {
                message.error('保存失败，请重试');
                return false;
              }
            }}
          >
            <AICheckContent
              loading={screeningLoading}
              scaleItems={scaleItems}
              labItems={labItems}
              imagingItems={imagingItems}
              selectedScaleIds={selectedScaleIds}
              selectedLabIds={selectedLabIds}
              selectedImagingIds={selectedImagingIds}
              onScaleChange={setSelectedScaleIds}
              onLabChange={setSelectedLabIds}
              onImagingChange={setSelectedImagingIds}
              aiSuggestion={aiSuggestion}
              confidence={aiConfidence}
            />
          </StepsForm.StepForm>

          {/* ======== Step 2: 检测结果录入 -- H1 FIX ======== */}
          <StepsForm.StepForm
            name="results"
            title="检测结果录入"
            initialValues={{
              lab_result_url: diagnosisData?.lab_result_url
                ? [urlToUploadFile(diagnosisData.lab_result_url)]
                : [],
              imaging_result_url: diagnosisData?.imaging_result_url
                ? [urlToUploadFile(diagnosisData.imaging_result_url)]
                : [],
            }}
            onFinish={async (values) => {
              try {
                const labUrl = values.lab_result_url?.[0]
                  ? getFileUrl(values.lab_result_url[0])
                  : undefined;
                const imgUrl = values.imaging_result_url?.[0]
                  ? getFileUrl(values.imaging_result_url[0])
                  : undefined;
                await updateInitialDiagnosis(patientId, {
                  lab_result_url: labUrl,
                  imaging_result_url: imgUrl,
                });
                await loadDiagnosisData();
                return true;
              } catch {
                message.error('保存失败，请重试');
                return false;
              }
            }}
          >
            {selectedLabIds.length > 0 ? (
              <ProFormUploadButton
                name="lab_result_url"
                label="实验室筛查结果（选填）"
                title="上传"
                max={5}
                fieldProps={{
                  ...getUploadProps({ dir: 'diagnosis', accept: 'image/*' }),
                  listType: 'picture-card',
                }}
              />
            ) : null}
            {selectedImagingIds.length > 0 ? (
              <ProFormUploadButton
                name="imaging_result_url"
                label="影像学资料（选填）"
                title="上传"
                max={5}
                fieldProps={{
                  ...getUploadProps({ dir: 'diagnosis', accept: 'image/*' }),
                  listType: 'picture-card',
                }}
              />
            ) : null}
            {selectedLabIds.length === 0 && selectedImagingIds.length === 0 ? (
              <Text type="secondary">
                未选择需要录入结果的检查项目，可直接进入下一步。
              </Text>
            ) : null}
          </StepsForm.StepForm>

          {/* ======== Step 3: AI 诊断分类 ======== */}
          <StepsForm.StepForm
            name="diagnosis"
            title="AI认知障碍分类诊断"
            initialValues={{
              diagnosis_results: diagnosisData?.diagnosis_results?.length
                ? diagnosisData.diagnosis_results
                : primaryDisease
                  ? [primaryDisease.id]
                  : [],
              diagnosis_note: diagnosisData?.diagnosis_note ?? '',
            }}
            onFinish={async (values) => {
              if (
                !values.diagnosis_results ||
                values.diagnosis_results.length === 0
              ) {
                message.warning('请选择至少一项诊断结果');
                return false;
              }
              try {
                await updateInitialDiagnosis(patientId, {
                  diagnosis_results: values.diagnosis_results,
                  diagnosis_note: values.diagnosis_note,
                });
                await loadPrescriptionData();
                return true;
              } catch {
                message.error('保存失败，请重试');
                return false;
              }
            }}
          >
            <AIDiagnosisContent
              loading={diagnosisLoading}
              primaryDisease={primaryDisease}
              otherDiseases={otherDiseases}
              preventionAdvice={preventionAdvice}
              diseaseNameMap={diseaseNameMap}
            />
            <ProFormSelect
              name="diagnosis_results"
              label="最终诊断结果"
              mode="multiple"
              placeholder="请选择诊断结果…"
              options={diseaseOptions}
              rules={[{ required: true, message: '请选择至少一项诊断' }]}
            />
            <ProFormTextArea
              name="diagnosis_note"
              label="分型备注"
              placeholder="请输入备注信息…"
              fieldProps={{ rows: 3 }}
            />
          </StepsForm.StepForm>

          {/* ======== Step 4: 综合处方 ======== */}
          <StepsForm.StepForm name="prescription" title="综合康复处方制定">
            <PrescriptionContent
              ref={prescriptionRef}
              loading={prescriptionLoading}
              aiSummary={aiPrescriptionSummary}
              initialMedications={initialMedications}
              initialCognitiveCards={initialCognitiveCards}
              initialDietContent={initialDietContent}
              initialExercises={initialExercises}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  );
};

export default Diagnosis;
