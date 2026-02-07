import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useRequest, useSearchParams } from '@umijs/max';
import {
  App,
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PatientAvatarInfoContent } from '@/components';
import { updateInitialDiagnosis } from '@/services/diagnosis';
import type { ScreeningItems } from '@/services/diagnosis/typings.d';
import { getDiseaseTypes } from '@/services/disease-type';
import { getImagingIndicators } from '@/services/imaging-indicator';
import { getLabIndicators } from '@/services/lab-indicator';
import {
  getDiseaseJudgement,
  getPrescriptionRecommendation,
  getScreeningRecommendation,
} from '@/services/llm';
import type {
  OtherPossibleDisease,
  PrimaryDisease,
} from '@/services/llm/typings.d';
import { getMedicines } from '@/services/medicine';
import { getPatient, updatePatient } from '@/services/patient-user';
import { getRehabLevels } from '@/services/rehab-level';
import { getFileUrl, getUploadProps } from '@/utils/upload';
import type { ScreeningCheckItem } from './components/AICheckContent';
import AICheckContent from './components/AICheckContent';
import AIDiagnosisContent from './components/AIDiagnosisContent';
import PrescriptionContent from './components/PrescriptionContent';
import useDiagnosisStyles from './index.style';

const { Text } = Typography;

const Diagnosis: React.FC = () => {
  const { styles } = useDiagnosisStyles();
  const { message, modal } = App.useApp();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id') ?? '';

  // -------- 患者信息 --------
  const { data: patientDetail, loading: patientLoading } = useRequest(
    () => getPatient(patientId),
    { ready: !!patientId },
  );

  // -------- 患者档案编辑 --------
  const [isEditingArchive, setIsEditingArchive] = useState(false);
  const [archiveData, setArchiveData] = useState({
    family_history: '',
    medical_history: '',
    medication_history: '',
  });

  useEffect(() => {
    if (patientDetail) {
      setArchiveData({
        family_history: patientDetail.family_history ?? '',
        medical_history: patientDetail.medical_history ?? '',
        medication_history: patientDetail.medication_history ?? '',
      });
    }
  }, [patientDetail]);

  const { run: runUpdateArchive } = useRequest(
    (data: Record<string, any>) => updatePatient(patientId, data),
    {
      manual: true,
      onSuccess: () => {
        message.success('保存成功');
        setIsEditingArchive(false);
      },
    },
  );

  // ======== Step 2: AI 检查推荐 ========
  const [scaleItems] = useState<ScreeningCheckItem[]>([
    { id: 'scale-1', name: 'AD-8（早期筛查）', note: '8 题快速筛查' },
    { id: 'scale-2', name: 'MMSE（简易精神状态）', note: '30 题标准评估' },
    { id: 'scale-3', name: 'MoCA（蒙特利尔）', note: '认知域全面评估' },
  ]);
  const [labItems, setLabItems] = useState<ScreeningCheckItem[]>([]);
  const [imagingItems, setImagingItems] = useState<ScreeningCheckItem[]>([]);
  const [selectedScaleIds, setSelectedScaleIds] = useState<string[]>([]);
  const [selectedLabIds, setSelectedLabIds] = useState<string[]>([]);
  const [selectedImagingIds, setSelectedImagingIds] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [aiExaminationSteps, setAiExaminationSteps] = useState<string | null>(
    null,
  );
  const [screeningLoading, setScreeningLoading] = useState(false);

  // ======== Step 4: AI 诊断 ========
  const [primaryDisease, setPrimaryDisease] = useState<PrimaryDisease | null>(
    null,
  );
  const [otherDiseases, setOtherDiseases] = useState<OtherPossibleDisease[]>(
    [],
  );
  const [diseaseNameMap, setDiseaseNameMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);

  // ======== Step 5: 处方 ========
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [aiPrescriptionSummary, setAiPrescriptionSummary] = useState<
    string | null
  >(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [cognitiveCards, setCognitiveCards] = useState<any[]>([]);
  const [dietContent, setDietContent] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  // Prescription edit modals
  const [form] = Form.useForm();
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [cognitiveModalVisible, setCognitiveModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [editingCognitive, setEditingCognitive] = useState<any>(null);
  const [editingExercise, setEditingExercise] = useState<any>(null);

  // -------- Step 2: 加载候选项并调用 LLM --------
  const loadScreeningData = useCallback(
    async (
      chiefComplaint: string,
      presentIllness: string,
      physicalSigns: string,
    ) => {
      setScreeningLoading(true);
      try {
        // 并行加载候选目录 (async-parallel)
        const [labRes, imagingRes] = await Promise.all([
          getLabIndicators({ limit: 200 }),
          getImagingIndicators({ limit: 200 }),
        ]);

        const labCandidates = labRes.data.items.map((l) => ({
          id: l.id,
          name: l.name,
          note: l.notes ?? '',
        }));
        const imagingCandidates = imagingRes.data.items.map((i) => ({
          id: i.id,
          name: i.name,
          note: i.notes ?? '',
        }));
        setLabItems(labCandidates);
        setImagingItems(imagingCandidates);

        // 构造候选项目给 LLM
        const screeningItems: ScreeningItems = {
          筛查量表: scaleItems.map((s) => ({
            id: s.id,
            name: s.name,
            note: s.note,
          })),
          实验室检查: labCandidates,
          影像学检查: imagingCandidates,
        };

        // 调用 LLM 推荐
        const { data: llmRes } = await getScreeningRecommendation({
          uuid: patientId,
          chief_complaint: chiefComplaint,
          present_illness: presentIllness,
          physical_signs: physicalSigns,
          screening_items: screeningItems,
        });

        setSelectedScaleIds(llmRes.selected_assessments ?? []);
        setSelectedLabIds(llmRes.selected_lab_tests ?? []);
        setSelectedImagingIds(llmRes.selected_imaging_tests ?? []);
        setAiSuggestion(llmRes.examination_steps);
        setAiExaminationSteps(llmRes.examination_steps);
        setAiConfidence(llmRes.prediction_confidence);
      } catch {
        message.error('加载检查推荐失败，请手动选择');
      } finally {
        setScreeningLoading(false);
      }
    },
    [patientId, scaleItems, message],
  );

  // -------- Step 4: 调用 LLM 诊断 --------
  const loadDiagnosisData = useCallback(async () => {
    setDiagnosisLoading(true);
    try {
      // 并行：获取疾病类型目录 + LLM 诊断 (async-parallel)
      const allSelectedNames = [
        ...scaleItems
          .filter((s) => selectedScaleIds.includes(s.id))
          .map((s) => s.name),
        ...labItems
          .filter((l) => selectedLabIds.includes(l.id))
          .map((l) => l.name),
        ...imagingItems
          .filter((i) => selectedImagingIds.includes(i.id))
          .map((i) => i.name),
      ];

      const [diseaseRes, llmRes] = await Promise.all([
        getDiseaseTypes({ limit: 200 }),
        getDiseaseJudgement({
          uuid: patientId,
          screening_items: allSelectedNames,
        }),
      ]);

      // Build disease name map (js-index-maps)
      const nameMap = new Map<string, string>();
      for (const d of diseaseRes.data.items) {
        nameMap.set(d.id, d.disease_name);
      }
      setDiseaseNameMap(nameMap);

      setPrimaryDisease(llmRes.data.primary_disease);
      setOtherDiseases(llmRes.data.other_possible_diseases ?? []);
    } catch {
      message.error('AI 诊断分析失败，请手动选择');
    } finally {
      setDiagnosisLoading(false);
    }
  }, [
    patientId,
    scaleItems,
    selectedScaleIds,
    labItems,
    selectedLabIds,
    imagingItems,
    selectedImagingIds,
    message,
  ]);

  // -------- Step 5: 调用 LLM 处方 --------
  const loadPrescriptionData = useCallback(async () => {
    setPrescriptionLoading(true);
    try {
      const { data: llmRes } = await getPrescriptionRecommendation({
        uuid: patientId,
      });

      // 并行解析药物和训练名称 (async-parallel)
      const [medRes, rehabRes] = await Promise.all([
        getMedicines({ limit: 200 }),
        getRehabLevels({ limit: 200 }),
      ]);

      // 将 LLM 返回的 ID 匹配为显示数据
      const medMap = new Map(medRes.data.items.map((m) => [m.id, m]));
      const rehabMap = new Map(rehabRes.data.items.map((r) => [r.id, r]));

      setMedications(
        (llmRes.medicines ?? [])
          .map((id) => {
            const med = medMap.get(id);
            return med
              ? {
                  id: med.id,
                  medicineName: med.name,
                  usage: med.usage ?? '',
                  dosage: '',
                }
              : null;
          })
          .filter(Boolean),
      );
      setCognitiveCards(
        (llmRes.trainings ?? [])
          .map((id) => {
            const rehab = rehabMap.get(id);
            return rehab
              ? {
                  id: rehab.id,
                  cardName: rehab.name,
                  difficulty: rehab.level_type ?? '',
                }
              : null;
          })
          .filter(Boolean),
      );
      setDietContent(llmRes.diet_prescription ?? '');
      setExercises(
        (llmRes.exercises ?? []).map((e, i) => ({
          id: `ex-${i}`,
          exerciseName: e.item,
          duration: `${e.quantity}${e.unit}`,
        })),
      );
      setAiPrescriptionSummary(llmRes.summary ?? null);
    } catch {
      message.error('AI 处方生成失败，请手动填写');
    } finally {
      setPrescriptionLoading(false);
    }
  }, [patientId, message]);

  // -------- 疾病类型选项 --------
  const diseaseOptions = useMemo(
    () =>
      Array.from(diseaseNameMap.entries()).map(([id, name]) => ({
        label: name,
        value: id,
      })),
    [diseaseNameMap],
  );

  // -------- 处方 CRUD callbacks --------
  const handleSubmitMedication = async () => {
    try {
      const values = await form.validateFields();
      if (editingMedication) {
        setMedications((prev) =>
          prev.map((item) =>
            item.id === editingMedication.id ? { ...item, ...values } : item,
          ),
        );
      } else {
        setMedications((prev) => [
          ...prev,
          { id: Date.now().toString(), ...values },
        ]);
      }
      setMedicationModalVisible(false);
      form.resetFields();
    } catch {
      /* validation */
    }
  };

  const handleSubmitCognitive = async () => {
    try {
      const values = await form.validateFields();
      if (editingCognitive) {
        setCognitiveCards((prev) =>
          prev.map((item) =>
            item.id === editingCognitive.id ? { ...item, ...values } : item,
          ),
        );
      } else {
        setCognitiveCards((prev) => [
          ...prev,
          { id: Date.now().toString(), ...values },
        ]);
      }
      setCognitiveModalVisible(false);
      form.resetFields();
    } catch {
      /* validation */
    }
  };

  const handleSubmitDiet = async () => {
    try {
      const values = await form.validateFields();
      setDietContent(values.dietContent);
      setDietModalVisible(false);
      form.resetFields();
    } catch {
      /* validation */
    }
  };

  const handleSubmitExercise = async () => {
    try {
      const values = await form.validateFields();
      if (editingExercise) {
        setExercises((prev) =>
          prev.map((item) =>
            item.id === editingExercise.id ? { ...item, ...values } : item,
          ),
        );
      } else {
        setExercises((prev) => [
          ...prev,
          { id: Date.now().toString(), ...values },
        ]);
      }
      setExerciseModalVisible(false);
      form.resetFields();
    } catch {
      /* validation */
    }
  };

  // -------- beforeunload guard --------
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  if (!patientId) {
    return (
      <PageContainer title={false}>
        <ProCard>未指定患者 ID</ProCard>
      </PageContainer>
    );
  }

  if (patientLoading || !patientDetail) {
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
      <ProCard className={styles.diagnosisContainer}>
        {/* 患者信息头部 */}
        <Flex gap={24} className={styles.patientInfoWrapper}>
          <div className={styles.patientInfoLeft}>
            <PatientAvatarInfoContent
              name={patientDetail.name}
              gender={patientDetail.gender}
              age={patientDetail.age}
              phone={patientDetail.phone}
              categories={patientDetail.categories}
            />
          </div>

          <Divider type="vertical" style={{ height: 'auto' }} />

          <div className={styles.patientInfoRight}>
            <div className={styles.patientArchiveSection}>
              <div className={styles.archiveGrid}>
                <div className={styles.archiveItem}>
                  <Text className={styles.archiveLabel}>家族史：</Text>
                  {isEditingArchive ? (
                    <Input
                      value={archiveData.family_history}
                      onChange={(e) =>
                        setArchiveData((prev) => ({
                          ...prev,
                          family_history: e.target.value,
                        }))
                      }
                      placeholder="请输入家族史…"
                    />
                  ) : (
                    <Text className={styles.archiveValue}>
                      {patientDetail.family_history || '--'}
                    </Text>
                  )}
                </div>
                <div className={styles.archiveItem}>
                  <Text className={styles.archiveLabel}>既往病史：</Text>
                  {isEditingArchive ? (
                    <Input
                      value={archiveData.medical_history}
                      onChange={(e) =>
                        setArchiveData((prev) => ({
                          ...prev,
                          medical_history: e.target.value,
                        }))
                      }
                      placeholder="请输入既往病史…"
                    />
                  ) : (
                    <Text className={styles.archiveValue}>
                      {patientDetail.medical_history || '--'}
                    </Text>
                  )}
                </div>
                <div className={styles.archiveItem}>
                  <Text className={styles.archiveLabel}>既往用药：</Text>
                  {isEditingArchive ? (
                    <Input
                      value={archiveData.medication_history}
                      onChange={(e) =>
                        setArchiveData((prev) => ({
                          ...prev,
                          medication_history: e.target.value,
                        }))
                      }
                      placeholder="请输入既往用药…"
                    />
                  ) : (
                    <Text className={styles.archiveValue}>
                      {patientDetail.medication_history || '--'}
                    </Text>
                  )}
                </div>
              </div>
              <div className={styles.archiveHeader}>
                {!isEditingArchive ? (
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    aria-label="编辑档案"
                    onClick={() => setIsEditingArchive(true)}
                  />
                ) : (
                  <Space>
                    <Button
                      type="link"
                      icon={<SaveOutlined />}
                      aria-label="保存档案"
                      onClick={() => runUpdateArchive(archiveData)}
                    />
                    <Button
                      type="link"
                      icon={<CloseOutlined />}
                      aria-label="取消编辑"
                      onClick={() => setIsEditingArchive(false)}
                    />
                  </Space>
                )}
              </div>
            </div>
          </div>
        </Flex>

        {/* StepsForm */}
        <StepsForm
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
                  {step > 0 && <Button onClick={onPre}>上一步</Button>}
                  <Button type="primary" onClick={onSubmit}>
                    {step === 4 ? '完成诊断' : '下一步'}
                  </Button>
                </Flex>
              );
            },
          }}
          onFinish={async () => {
            try {
              // 最终提交处方数据
              await updateInitialDiagnosis(patientId, {
                medicine_ids: medications.map((m) => m.id),
                rehab_level_ids: cognitiveCards.map((c) => c.id),
                exercise_plan: exercises.map((e) => ({
                  name: e.exerciseName,
                  quantity: 1,
                  unit: e.duration,
                })),
                diet_plan: dietContent,
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
          {/* ======== Step 1: 初诊 ======== */}
          <StepsForm.StepForm
            name="initial"
            title="初诊"
            onFinish={async (values) => {
              try {
                await updateInitialDiagnosis(patientId, {
                  chief_complaint: values.chief_complaint,
                  physical_signs: values.physical_signs,
                  present_illness: values.present_illness,
                });
                // 进入下一步前加载 AI 推荐 (不阻塞步骤切换)
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

          {/* ======== Step 2: AI 检查推荐 ======== */}
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
                // 构建选中项
                const screeningItemsData: ScreeningItems = {
                  筛查量表: scaleItems
                    .filter((s) => selectedScaleIds.includes(s.id))
                    .map((s) => ({ id: s.id, name: s.name, note: s.note })),
                  实验室检查: labItems
                    .filter((l) => selectedLabIds.includes(l.id))
                    .map((l) => ({ id: l.id, name: l.name, note: l.note })),
                  影像学检查: imagingItems
                    .filter((i) => selectedImagingIds.includes(i.id))
                    .map((i) => ({ id: i.id, name: i.name, note: i.note })),
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

          {/* ======== Step 3: 检测结果录入 ======== */}
          <StepsForm.StepForm
            name="results"
            title="检测结果录入"
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
                // 进入 Step 4 前加载 AI 诊断
                loadDiagnosisData();
                return true;
              } catch {
                message.error('保存失败，请重试');
                return false;
              }
            }}
          >
            {selectedLabIds.length > 0 && (
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
            )}
            {selectedImagingIds.length > 0 && (
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
            )}
            {selectedLabIds.length === 0 && selectedImagingIds.length === 0 && (
              <Text type="secondary">
                未选择需要录入结果的检查项目，可直接进入下一步。
              </Text>
            )}
          </StepsForm.StepForm>

          {/* ======== Step 4: AI 诊断分类 ======== */}
          <StepsForm.StepForm
            name="diagnosis"
            title="AI认知障碍分类诊断"
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
                // 进入 Step 5 前加载处方推荐
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
              diseaseNameMap={diseaseNameMap}
            />
            <ProFormSelect
              name="diagnosis_results"
              label="最终诊断结果"
              mode="multiple"
              placeholder="请选择诊断结果…"
              options={diseaseOptions}
              initialValue={primaryDisease ? [primaryDisease.disease_id] : []}
              rules={[{ required: true, message: '请选择至少一项诊断' }]}
            />
            <ProFormTextArea
              name="diagnosis_note"
              label="分型备注"
              placeholder="请输入备注信息…"
              fieldProps={{ rows: 3 }}
            />
          </StepsForm.StepForm>

          {/* ======== Step 5: 综合处方 ======== */}
          <StepsForm.StepForm name="prescription" title="综合康复处方制定">
            <PrescriptionContent
              loading={prescriptionLoading}
              aiSummary={aiPrescriptionSummary}
              medications={medications}
              cognitiveCards={cognitiveCards}
              dietContent={dietContent}
              exercises={exercises}
              onMedicationsChange={setMedications}
              onCognitiveCardsChange={setCognitiveCards}
              onDietContentChange={setDietContent}
              onExercisesChange={setExercises}
              onAddMedication={() => {
                setEditingMedication(null);
                form.resetFields();
                setMedicationModalVisible(true);
              }}
              onEditMedication={(item) => {
                setEditingMedication(item);
                form.setFieldsValue(item);
                setMedicationModalVisible(true);
              }}
              onDeleteMedication={(id) => {
                modal.confirm({
                  title: '确认删除',
                  content: '确定要删除该药物？',
                  onOk: () =>
                    setMedications((prev) => prev.filter((m) => m.id !== id)),
                });
              }}
              onAddCognitive={() => {
                setEditingCognitive(null);
                form.resetFields();
                setCognitiveModalVisible(true);
              }}
              onEditCognitive={(item) => {
                setEditingCognitive(item);
                form.setFieldsValue(item);
                setCognitiveModalVisible(true);
              }}
              onDeleteCognitive={(id) => {
                modal.confirm({
                  title: '确认删除',
                  content: '确定要删除该训练项？',
                  onOk: () =>
                    setCognitiveCards((prev) =>
                      prev.filter((c) => c.id !== id),
                    ),
                });
              }}
              onEditDiet={() => {
                form.setFieldsValue({ dietContent });
                setDietModalVisible(true);
              }}
              onAddExercise={() => {
                setEditingExercise(null);
                form.resetFields();
                setExerciseModalVisible(true);
              }}
              onEditExercise={(item) => {
                setEditingExercise(item);
                form.setFieldsValue(item);
                setExerciseModalVisible(true);
              }}
              onDeleteExercise={(id) => {
                modal.confirm({
                  title: '确认删除',
                  content: '确定要删除该运动项？',
                  onOk: () =>
                    setExercises((prev) => prev.filter((e) => e.id !== id)),
                });
              }}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>

      {/* -------- 处方编辑弹窗 -------- */}
      <Modal
        title={editingMedication ? '编辑药物' : '添加药物'}
        open={medicationModalVisible}
        onOk={handleSubmitMedication}
        onCancel={() => {
          setMedicationModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="medicineName"
            label="药品名称"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入药品名称…" />
          </Form.Item>
          <Form.Item name="usage" label="用法" rules={[{ required: true }]}>
            <Input placeholder="请输入用法…" />
          </Form.Item>
          <Form.Item name="dosage" label="剂量" rules={[{ required: true }]}>
            <Input placeholder="请输入剂量…" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingCognitive ? '编辑训练项' : '添加训练项'}
        open={cognitiveModalVisible}
        onOk={handleSubmitCognitive}
        onCancel={() => {
          setCognitiveModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cardName"
            label="训练名称"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入训练名称…" />
          </Form.Item>
          <Form.Item
            name="difficulty"
            label="难度"
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择难度…">
              <Select.Option value="难度：初级">初级</Select.Option>
              <Select.Option value="难度：中等">中等</Select.Option>
              <Select.Option value="难度：高">高</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑饮食处方"
        open={dietModalVisible}
        onOk={handleSubmitDiet}
        onCancel={() => {
          setDietModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="dietContent"
            label="饮食建议"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} placeholder="请输入饮食建议…" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingExercise ? '编辑运动项' : '添加运动项'}
        open={exerciseModalVisible}
        onOk={handleSubmitExercise}
        onCancel={() => {
          setExerciseModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="exerciseName"
            label="运动名称"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入运动名称…" />
          </Form.Item>
          <Form.Item name="duration" label="时长" rules={[{ required: true }]}>
            <Input placeholder="请输入时长…" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Diagnosis;
