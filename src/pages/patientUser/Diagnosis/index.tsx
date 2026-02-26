import {
  PageContainer,
  ProCard,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import type { FormInstance } from 'antd';
import { App, Button, Flex, Spin, Typography } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { updateDiagnosis } from '@/services/diagnosis';
import type { ScreeningItems } from '@/services/diagnosis/typings.d';
import { getFileUrl, getUploadProps, urlToUploadFile } from '@/utils/upload';
import AICheckContent from './components/AICheckContent';
import AIDiagnosisContent from './components/AIDiagnosisContent';
import PatientInfoHeader from './components/PatientInfoHeader';
import type { PrescriptionDataRef } from './components/PrescriptionContent';
import PrescriptionContent from './components/PrescriptionContent';
import useDiagnosisFlow from './hooks/useDiagnosisFlow';

const { Text } = Typography;

const Diagnosis: React.FC = () => {
  const { message } = App.useApp();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id') ?? '';

  const prescriptionRef = useRef<PrescriptionDataRef>(null);
  const formMapRef = useRef<React.MutableRefObject<FormInstance | undefined>[]>(
    [],
  );

  const {
    initialLoading,
    patientDetail,
    refreshPatientDetail,
    diagnosisData,
    initialStep,
    ensureDiagnosisId,
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
    prescriptionDataVersion,
    loadPrescriptionData,
  } = useDiagnosisFlow(patientId);

  const selectedLabItems = useMemo(
    () => labItems.filter((item) => selectedLabIds.includes(item.id)),
    [labItems, selectedLabIds],
  );
  const selectedImagingItems = useMemo(
    () => imagingItems.filter((item) => selectedImagingIds.includes(item.id)),
    [imagingItems, selectedImagingIds],
  );

  // -------- Step 2 上传自动保存 --------
  const uploadFieldProps = useMemo(
    () => ({
      ...getUploadProps({ dir: 'diagnosis', accept: 'image/*' }),
      listType: 'picture-card' as const,
    }),
    [],
  );
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const extractStep2ImageUrls = useCallback(() => {
    const values = formMapRef.current?.[2]?.current?.getFieldsValue() ?? {};
    const labResultImages: Record<string, string> = {};
    const imagingResultImages: Record<string, string> = {};
    for (const [key, fileList] of Object.entries(values)) {
      const arr = fileList as unknown[];
      if (!arr?.length) continue;
      const url = getFileUrl((arr as any[])[0]);
      if (!url) continue;
      if (key.startsWith('lab__')) {
        labResultImages[key.slice(5)] = url;
      } else if (key.startsWith('img__')) {
        imagingResultImages[key.slice(5)] = url;
      }
    }
    return { labResultImages, imagingResultImages };
  }, []);

  const handleUploadChange = useCallback(
    (info: { file: { status?: string } }) => {
      const { status } = info.file;
      if (status !== 'done' && status !== 'removed') return;

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          const { labResultImages, imagingResultImages } =
            extractStep2ImageUrls();
          const id = await ensureDiagnosisId();
          await updateDiagnosis(patientId, id, {
            lab_result_images:
              Object.keys(labResultImages).length > 0
                ? labResultImages
                : undefined,
            imaging_result_images:
              Object.keys(imagingResultImages).length > 0
                ? imagingResultImages
                : undefined,
          });
        } catch (error) {
          console.error('Auto-save upload failed:', error);
        }
      }, 300);
    },
    [patientId, ensureDiagnosisId, extractStep2ImageUrls],
  );

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

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

  // LLM 诊断结果返回后，自动填充 diagnosis_results 和 diagnosis_note
  useEffect(() => {
    if (!primaryDisease) return;
    const diagnosisForm = formMapRef.current?.[3]?.current; // Step 3: diagnosis
    if (!diagnosisForm) return;

    const currentResults = diagnosisForm.getFieldValue('diagnosis_results');
    if (!currentResults?.length) {
      diagnosisForm.setFieldsValue({
        diagnosis_results: [primaryDisease.id],
      });
    }

    const currentNote = diagnosisForm.getFieldValue('diagnosis_note');
    if (!currentNote) {
      const name = diseaseNameMap.get(primaryDisease.id) ?? primaryDisease.id;
      diagnosisForm.setFieldsValue({
        diagnosis_note: [
          `首选诊断：${name}（置信度 ${(primaryDisease.confidence * 100).toFixed(0)}%）`,
          `依据：${primaryDisease.reason}`,
        ].join('\n'),
      });
    }
  }, [primaryDisease, diseaseNameMap]);

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

  return (
    <PageContainer title={false}>
      <ProCard style={{ maxWidth: 1200, margin: '0 auto' }}>
        <PatientInfoHeader
          patientDetail={patientDetail}
          onSaved={refreshPatientDetail}
        />

        <StepsForm
          formMapRef={formMapRef}
          current={currentStep}
          onCurrentChange={setCurrentStep}
          containerStyle={{ margin: 0, width: '100%' }}
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
              const id = await ensureDiagnosisId();
              await updateDiagnosis(patientId, id, {
                medicine_ids: data?.medications.map((m) => m.id) ?? [],
                rehab_level_ids: data?.cognitiveCards.map((c) => c.id) ?? [],
                exercise_plan: (data?.exercises ?? []).map((e) => ({
                  name: e.name,
                  quantity: e.quantity,
                  unit: e.unit,
                })),
                diet_plan: data?.dietContent ?? '',
                prescription_summary: aiPrescriptionSummary ?? undefined,
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
                const id = await ensureDiagnosisId();
                await updateDiagnosis(patientId, id, {
                  chief_complaint: values.chief_complaint,
                  physical_signs: values.physical_signs,
                  present_illness: values.present_illness,
                });
                loadScreeningData(
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
              rules={[{ required: true }]}
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
                const id = await ensureDiagnosisId();
                await updateDiagnosis(patientId, id, {
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

          {/* ======== Step 2: 检测结果录入 (per-indicator upload) ======== */}
          <StepsForm.StepForm
            name="results"
            title="检测结果录入"
            initialValues={(() => {
              const vals: Record<string, unknown[]> = {};
              const labMap = diagnosisData?.lab_result_images;
              if (labMap) {
                for (const [indicatorId, url] of Object.entries(labMap)) {
                  vals[`lab__${indicatorId}`] = [urlToUploadFile(url)];
                }
              }
              const imgMap = diagnosisData?.imaging_result_images;
              if (imgMap) {
                for (const [indicatorId, url] of Object.entries(imgMap)) {
                  vals[`img__${indicatorId}`] = [urlToUploadFile(url)];
                }
              }
              return vals;
            })()}
            onFinish={async () => {
              try {
                const { labResultImages, imagingResultImages } =
                  extractStep2ImageUrls();
                const id = await ensureDiagnosisId();
                await updateDiagnosis(patientId, id, {
                  lab_result_images:
                    Object.keys(labResultImages).length > 0
                      ? labResultImages
                      : undefined,
                  imaging_result_images:
                    Object.keys(imagingResultImages).length > 0
                      ? imagingResultImages
                      : undefined,
                });
                loadDiagnosisData();
                return true;
              } catch {
                message.error('保存失败，请重试');
                return false;
              }
            }}
          >
            {selectedLabItems.length > 0 ? (
              <>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  实验室筛查结果
                </Text>
                {selectedLabItems.map((item) => (
                  <ProFormUploadButton
                    key={item.id}
                    name={`lab__${item.id}`}
                    label={item.name}
                    title="上传"
                    max={1}
                    fieldProps={{
                      ...uploadFieldProps,
                      onChange: handleUploadChange,
                    }}
                  />
                ))}
              </>
            ) : null}
            {selectedImagingItems.length > 0 ? (
              <>
                <Text strong style={{ display: 'block', margin: '16px 0 8px' }}>
                  影像学资料
                </Text>
                {selectedImagingItems.map((item) => (
                  <ProFormUploadButton
                    key={item.id}
                    name={`img__${item.id}`}
                    label={item.name}
                    title="上传"
                    max={1}
                    fieldProps={{
                      ...uploadFieldProps,
                      onChange: handleUploadChange,
                    }}
                  />
                ))}
              </>
            ) : null}
            {selectedLabItems.length === 0 &&
            selectedImagingItems.length === 0 ? (
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
                const id = await ensureDiagnosisId();
                await updateDiagnosis(patientId, id, {
                  diagnosis_results: values.diagnosis_results,
                  diagnosis_note: values.diagnosis_note,
                });
                loadPrescriptionData();
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
              key={prescriptionDataVersion}
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
