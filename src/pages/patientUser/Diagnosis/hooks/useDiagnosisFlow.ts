import { useCallback, useEffect, useRef, useState } from 'react';
import { createDiagnosis, getCurrentDiagnosis } from '@/services/diagnosis';
import type { DiagnosisDetailResponse } from '@/services/diagnosis/typings.d';
import { getDiagnosticScales } from '@/services/diagnostic-scale';
import { getDiseaseTypes } from '@/services/disease-type';
import { getImagingIndicators } from '@/services/imaging-indicator';
import { getLabIndicators } from '@/services/lab-indicator';
import {
  getDiseaseJudgement,
  getPrescriptionRecommendation,
  getScreeningRecommendation,
} from '@/services/llm';
import type {
  LlmDiseaseJudgementResponse,
  OtherPossibleDisease,
  PrimaryDisease,
} from '@/services/llm/typings.d';
import { getMedicines } from '@/services/medicine';
import { getPatient } from '@/services/patient-user';
import type {
  PatientDetail,
  PrescriptionCognitiveItem,
  PrescriptionExerciseItem,
  PrescriptionMedicationItem,
} from '@/services/patient-user/typings.d';
import { getRehabLevels } from '@/services/rehab-level';
import {
  mapCognitiveFromIds,
  mapExercisesFromPlan,
  mapMedicationsFromIds,
} from '@/utils/prescriptionMapping';
import type { ScreeningCheckItem } from '../components/AICheckContent';

const CANDIDATE_FETCH_LIMIT = 100;

// -------- computeCurrentStep (with C2 fix) --------
export function computeCurrentStep(
  data: DiagnosisDetailResponse | null,
): number {
  if (!data) return 0;
  if (data.diagnosis_status === '已完成') return -1;

  // Step 0: 初诊
  if (!data.chief_complaint) return 0;

  // Step 1: AI 筛查推荐
  const hasScreening =
    (data.screening_items?.selected_assessments?.length ?? 0) > 0 ||
    (data.screening_items?.selected_lab_tests?.length ?? 0) > 0 ||
    (data.screening_items?.selected_imaging_tests?.length ?? 0) > 0;
  if (!hasScreening) return 1;

  // Step 2 or 3: 仅当所有选中检查项都已上传时才跳到 Step 3
  if (!data.diagnosis_results?.length) {
    const selectedLabs = data.screening_items?.selected_lab_tests ?? [];
    const selectedImaging = data.screening_items?.selected_imaging_tests ?? [];
    const hasExpected = selectedLabs.length > 0 || selectedImaging.length > 0;
    const allLabUploaded = selectedLabs.every(
      (id) => data.lab_result_images?.[id],
    );
    const allImagingUploaded = selectedImaging.every(
      (id) => data.imaging_result_images?.[id],
    );

    if (hasExpected && allLabUploaded && allImagingUploaded) return 3;
    return 2;
  }

  // Step 4: 处方
  return 4;
}

// -------- 候选项缓存类型 --------
interface CandidateCache {
  scales: ScreeningCheckItem[];
  labs: ScreeningCheckItem[];
  imaging: ScreeningCheckItem[];
}

// -------- Hook 返回值 --------
export interface UseDiagnosisFlowReturn {
  initialLoading: boolean;
  patientDetail: PatientDetail | null;
  refreshPatientDetail: () => Promise<void>;
  diagnosisData: DiagnosisDetailResponse | null;
  initialStep: number;
  diagnosisId: string | null;
  ensureDiagnosisId: () => Promise<string>;

  // 筛查相关
  screeningLoading: boolean;
  scaleItems: ScreeningCheckItem[];
  labItems: ScreeningCheckItem[];
  imagingItems: ScreeningCheckItem[];
  selectedScaleIds: string[];
  selectedLabIds: string[];
  selectedImagingIds: string[];
  setSelectedScaleIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedLabIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedImagingIds: React.Dispatch<React.SetStateAction<string[]>>;
  aiSuggestion: string | null;
  aiConfidence: number | null;
  aiExaminationSteps: string | null;
  loadScreeningData: (cc: string, pi: string, ps: string) => Promise<void>;

  // 诊断相关
  diagnosisLoading: boolean;
  primaryDisease: PrimaryDisease | null;
  otherDiseases: OtherPossibleDisease[];
  preventionAdvice: string;
  diseaseNameMap: Map<string, string>;
  loadDiagnosisData: () => Promise<void>;

  // 处方相关
  prescriptionLoading: boolean;
  aiPrescriptionSummary: string | null;
  initialMedications: PrescriptionMedicationItem[];
  initialCognitiveCards: PrescriptionCognitiveItem[];
  initialDietContent: string;
  initialExercises: PrescriptionExerciseItem[];
  /** 数据加载完成后递增，用作 key 强制子组件重新挂载 */
  prescriptionDataVersion: number;
  loadPrescriptionData: () => Promise<void>;
}

export default function useDiagnosisFlow(
  patientId: string,
): UseDiagnosisFlowReturn {
  // M1: mounted guard for async cleanup
  const mountedRef = useRef(true);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  // -------- 初始加载状态 --------
  const [initialLoading, setInitialLoading] = useState(true);
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(
    null,
  );
  const [diagnosisData, setDiagnosisData] =
    useState<DiagnosisDetailResponse | null>(null);
  const [initialStep, setInitialStep] = useState(0);

  // -------- diagnosisId 状态 (rerender-use-ref-transient-values) --------
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const diagnosisIdRef = useRef<string | null>(null);
  const creatingRef = useRef<Promise<string> | null>(null);

  // -------- 筛查状态 --------
  const [screeningLoading, setScreeningLoading] = useState(false);
  const [scaleItems, setScaleItems] = useState<ScreeningCheckItem[]>([]);
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

  // -------- 诊断状态 --------
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [primaryDisease, setPrimaryDisease] = useState<PrimaryDisease | null>(
    null,
  );
  const [otherDiseases, setOtherDiseases] = useState<OtherPossibleDisease[]>(
    [],
  );
  const [preventionAdvice, setPreventionAdvice] = useState('');
  const [diseaseNameMap, setDiseaseNameMap] = useState<Map<string, string>>(
    new Map(),
  );

  // -------- 处方状态 --------
  const [prescriptionDataVersion, setPrescriptionDataVersion] = useState(0);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [aiPrescriptionSummary, setAiPrescriptionSummary] = useState<
    string | null
  >(null);
  const [initialMedications, setInitialMedications] = useState<
    PrescriptionMedicationItem[]
  >([]);
  const [initialCognitiveCards, setInitialCognitiveCards] = useState<
    PrescriptionCognitiveItem[]
  >([]);
  const [initialDietContent, setInitialDietContent] = useState('');
  const [initialExercises, setInitialExercises] = useState<
    PrescriptionExerciseItem[]
  >([]);

  // -------- 候选项缓存 (js-cache-function-results) --------
  const candidateCache = useRef<CandidateCache | null>(null);

  // -------- ensureDiagnosisId (并发安全，409 回退) --------
  const ensureDiagnosisId = useCallback(async (): Promise<string> => {
    if (diagnosisIdRef.current) return diagnosisIdRef.current;
    if (creatingRef.current) return creatingRef.current;

    creatingRef.current = createDiagnosis(patientId)
      .then(({ data }) => {
        diagnosisIdRef.current = data.diagnosis_id;
        if (mountedRef.current) setDiagnosisId(data.diagnosis_id);
        return data.diagnosis_id;
      })
      .catch(async (err) => {
        // 409 = 已有诊断中记录，回退获取
        if (err?.response?.status === 409) {
          const { data } = await getCurrentDiagnosis(patientId);
          const id = data.diagnosis_id ?? '';
          diagnosisIdRef.current = id;
          if (mountedRef.current) setDiagnosisId(id);
          return id;
        }
        throw err;
      })
      .finally(() => {
        creatingRef.current = null;
      });

    return creatingRef.current;
  }, [patientId]);

  // -------- H3: 仅加载候选项（resume 路径，不调用 LLM） --------
  const loadCandidatesOnly = useCallback(async () => {
    if (candidateCache.current) {
      setScaleItems(candidateCache.current.scales);
      setLabItems(candidateCache.current.labs);
      setImagingItems(candidateCache.current.imaging);
      return;
    }

    const [scaleRes, labRes, imagingRes] = await Promise.all([
      getDiagnosticScales({ limit: CANDIDATE_FETCH_LIMIT }),
      getLabIndicators({ limit: CANDIDATE_FETCH_LIMIT }),
      getImagingIndicators({ limit: CANDIDATE_FETCH_LIMIT }),
    ]);

    if (!mountedRef.current) return;

    const scales = scaleRes.data.items.map((s) => ({
      id: s.id,
      name: s.name,
      note: s.introduction ?? '',
    }));
    const labs = labRes.data.items.map((l) => ({
      id: l.id,
      name: l.name,
      note: l.notes ?? '',
    }));
    const imaging = imagingRes.data.items.map((i) => ({
      id: i.id,
      name: i.name,
      note: i.notes ?? '',
    }));

    candidateCache.current = { scales, labs, imaging };
    setScaleItems(scales);
    setLabItems(labs);
    setImagingItems(imaging);
  }, []);

  // -------- 新鲜入口：候选项 + LLM 推荐 --------
  const loadScreeningData = useCallback(
    async (cc: string, pi: string, ps: string) => {
      setScreeningLoading(true);
      try {
        // 候选项 + LLM 并行 (async-parallel)
        const candidatesPromise = loadCandidatesOnly();
        const llmPromise = getScreeningRecommendation({
          uuid: patientId,
          chief_complaint: cc,
          present_illness: pi,
          physical_signs: ps,
        });

        await candidatesPromise;
        const { data: llmRes } = await llmPromise;

        if (!mountedRef.current) return;

        setSelectedScaleIds(llmRes.selected_assessments ?? []);
        setSelectedLabIds(llmRes.selected_lab_tests ?? []);
        setSelectedImagingIds(llmRes.selected_imaging_tests ?? []);
        setAiSuggestion(llmRes.examination_steps);
        setAiExaminationSteps(llmRes.examination_steps);
        setAiConfidence(llmRes.prediction_confidence);
      } catch (error) {
        console.error('Failed to load screening data:', error);
      } finally {
        if (mountedRef.current) setScreeningLoading(false);
      }
    },
    [patientId, loadCandidatesOnly],
  );

  // -------- 加载疾病类型目录 --------
  const loadDiseaseTypes = useCallback(async () => {
    const diseaseRes = await getDiseaseTypes({ limit: CANDIDATE_FETCH_LIMIT });
    if (!mountedRef.current) return;

    const nameMap = new Map<string, string>();
    for (const d of diseaseRes.data.items) {
      nameMap.set(d.id, d.disease_name);
    }
    setDiseaseNameMap(nameMap);
  }, []);

  // -------- 加载 AI 诊断 --------
  const loadDiagnosisData = useCallback(async () => {
    setDiagnosisLoading(true);
    try {
      const [, llmRes] = await Promise.all([
        loadDiseaseTypes(),
        getDiseaseJudgement({ uuid: patientId }),
      ]);

      if (!mountedRef.current) return;

      const result: LlmDiseaseJudgementResponse = llmRes.data;
      setPrimaryDisease(result.primary_disease);
      setOtherDiseases(result.other_possible_diseases ?? []);
      setPreventionAdvice(result.prevention_advice);
    } catch (error) {
      console.error('Failed to load diagnosis data:', error);
    } finally {
      if (mountedRef.current) setDiagnosisLoading(false);
    }
  }, [patientId, loadDiseaseTypes]);

  // -------- 加载 AI 处方 --------
  const loadPrescriptionData = useCallback(async () => {
    setPrescriptionLoading(true);
    try {
      const { data: llmRes } = await getPrescriptionRecommendation({
        uuid: patientId,
      });

      // 并行解析药物和训练名称 (async-parallel)
      const [medRes, rehabRes] = await Promise.all([
        getMedicines({ limit: CANDIDATE_FETCH_LIMIT }),
        getRehabLevels({ limit: CANDIDATE_FETCH_LIMIT }),
      ]);

      if (!mountedRef.current) return;

      const medMap = new Map(medRes.data.items.map((m) => [m.id, m]));
      const rehabMap = new Map(rehabRes.data.items.map((r) => [r.id, r]));

      setInitialMedications(
        mapMedicationsFromIds(llmRes.medicines ?? [], medMap),
      );
      setInitialCognitiveCards(
        mapCognitiveFromIds(llmRes.trainings ?? [], rehabMap),
      );
      setInitialDietContent(llmRes.diet_prescription ?? '');
      setInitialExercises(mapExercisesFromPlan(llmRes.exercises ?? []));

      setAiPrescriptionSummary(llmRes.summary ?? null);
    } catch (error) {
      console.error('Failed to load prescription data:', error);
    } finally {
      if (mountedRef.current) {
        setPrescriptionLoading(false);
        setPrescriptionDataVersion((v) => v + 1);
      }
    }
  }, [patientId]);

  // -------- H2: 从已保存 ID 解析处方显示数据 --------
  const resolvePrescriptionData = useCallback(
    async (data: DiagnosisDetailResponse) => {
      const hasMeds = data.medicine_ids?.length > 0;
      const hasRehab = data.rehab_level_ids?.length > 0;
      if (
        !hasMeds &&
        !hasRehab &&
        !data.diet_plan &&
        !data.exercise_plan?.length
      )
        return;

      const [medRes, rehabRes] = await Promise.all([
        hasMeds ? getMedicines({ limit: CANDIDATE_FETCH_LIMIT }) : null,
        hasRehab ? getRehabLevels({ limit: CANDIDATE_FETCH_LIMIT }) : null,
      ]);

      if (!mountedRef.current) return;

      if (medRes) {
        const medMap = new Map(medRes.data.items.map((m) => [m.id, m]));
        setInitialMedications(mapMedicationsFromIds(data.medicine_ids, medMap));
      }

      if (rehabRes) {
        const rehabMap = new Map(rehabRes.data.items.map((r) => [r.id, r]));
        setInitialCognitiveCards(
          mapCognitiveFromIds(data.rehab_level_ids, rehabMap),
        );
      }

      if (data.diet_plan) {
        setInitialDietContent(data.diet_plan);
      }

      if (data.exercise_plan?.length) {
        setInitialExercises(mapExercisesFromPlan(data.exercise_plan));
      }

      if (data.prescription_summary) {
        setAiPrescriptionSummary(data.prescription_summary);
      }
    },
    [],
  );

  // -------- 初始化（mount 时） --------
  useEffect(() => {
    if (!patientId) {
      setInitialLoading(false);
      return;
    }

    (async () => {
      try {
        // async-parallel: 患者信息 + 当前诊疗数据
        const [patientRes, diagnosisRes] = await Promise.all([
          getPatient(patientId),
          getCurrentDiagnosis(patientId),
        ]);

        if (!mountedRef.current) return;

        setPatientDetail(patientRes.data);

        let saved = diagnosisRes.data;

        // 已完成或无记录 → 创建新诊疗记录（复诊）
        if (saved.diagnosis_status === '已完成' || saved.diagnosis_id == null) {
          try {
            const { data: createRes } = await createDiagnosis(patientId);
            if (!mountedRef.current) return;
            // 重置为空白诊疗数据
            saved = {
              ...saved,
              diagnosis_id: createRes.diagnosis_id,
              diagnosis_status: null,
              completed_at: null,
              chief_complaint: null,
              physical_signs: null,
              present_illness: null,
              screening_items: null,
              examination_steps: null,
              lab_result_images: null,
              blood_routine_url: null,
              imaging_result_images: null,
              diagnosis_results: [],
              diagnosis_note: null,
              medicine_ids: [],
              rehab_level_ids: [],
              exercise_plan: [],
              diet_plan: null,
              prescription_summary: null,
            };
          } catch (error) {
            console.error('Failed to create diagnosis:', error);
          }
        }

        setDiagnosisData(saved);

        // 存储 diagnosisId
        diagnosisIdRef.current = saved.diagnosis_id;
        setDiagnosisId(saved.diagnosis_id);

        const step = computeCurrentStep(saved);
        setInitialStep(step);

        // 根据计算步骤恢复数据
        if (step >= 1 && saved) {
          // H3: 加载候选项（resume 路径，不调用 LLM）
          await loadCandidatesOnly();
          if (!mountedRef.current) return;

          // 从保存数据恢复选中状态
          if (saved.screening_items) {
            setSelectedScaleIds(
              saved.screening_items.selected_assessments ?? [],
            );
            setSelectedLabIds(saved.screening_items.selected_lab_tests ?? []);
            setSelectedImagingIds(
              saved.screening_items.selected_imaging_tests ?? [],
            );
          }
          if (saved.examination_steps) {
            setAiExaminationSteps(saved.examination_steps);
          }
        }

        if (step >= 3 && saved) {
          // 加载疾病类型目录
          await loadDiseaseTypes();
        }

        if (step >= 4 && saved) {
          // H2: 解析处方 ID 为显示对象
          await resolvePrescriptionData(saved);
        }
      } catch (error) {
        console.error('Failed to initialize diagnosis flow:', error);
      } finally {
        if (mountedRef.current) setInitialLoading(false);
      }
    })();
  }, [
    patientId,
    loadCandidatesOnly,
    loadDiseaseTypes,
    resolvePrescriptionData,
  ]);

  const refreshPatientDetail = useCallback(async () => {
    try {
      const res = await getPatient(patientId);
      if (mountedRef.current) {
        setPatientDetail(res.data);
      }
    } catch (error) {
      console.error('Failed to refresh patient detail:', error);
    }
  }, [patientId]);

  return {
    initialLoading,
    patientDetail,
    refreshPatientDetail,
    diagnosisData,
    initialStep,
    diagnosisId,
    ensureDiagnosisId,

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

    diagnosisLoading,
    primaryDisease,
    otherDiseases,
    preventionAdvice,
    diseaseNameMap,
    loadDiagnosisData,

    prescriptionLoading,
    aiPrescriptionSummary,
    initialMedications,
    initialCognitiveCards,
    initialDietContent,
    initialExercises,
    prescriptionDataVersion,
    loadPrescriptionData,
  };
}
