import { useCallback, useEffect, useRef, useState } from 'react';
import { getInitialDiagnosis } from '@/services/diagnosis';
import type { InitialDiagnosisDetailResponse } from '@/services/diagnosis/typings.d';
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
import type { PatientDetail } from '@/services/patient-user/typings.d';
import { getRehabLevels } from '@/services/rehab-level';
import type { ScreeningCheckItem } from '../components/AICheckContent';

// -------- 处方显示数据类型 --------
export interface MedicationDisplayItem {
  id: string;
  medicineName: string;
  usage: string;
  dosage: string;
}

export interface CognitiveDisplayItem {
  id: string;
  cardName: string;
  difficulty: string;
}

export interface ExerciseDisplayItem {
  id: string;
  exerciseName: string;
  duration: string;
}

// -------- computeCurrentStep (with C2 fix) --------
export function computeCurrentStep(
  data: InitialDiagnosisDetailResponse | null,
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

  // Step 2 or 3: C2 FIX
  if (!data.diagnosis_results?.length) {
    // 已上传结果 → 进入 Step 3（AI 诊断）
    if (data.lab_result_url || data.imaging_result_url) return 3;
    // 否则进入 Step 2（上传结果 — 自然中断点）
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
  diagnosisData: InitialDiagnosisDetailResponse | null;
  initialStep: number;

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
  preventionAdvice: string | null;
  diseaseNameMap: Map<string, string>;
  loadDiagnosisData: () => Promise<void>;

  // 处方相关
  prescriptionLoading: boolean;
  aiPrescriptionSummary: string | null;
  initialMedications: MedicationDisplayItem[];
  initialCognitiveCards: CognitiveDisplayItem[];
  initialDietContent: string;
  initialExercises: ExerciseDisplayItem[];
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
    useState<InitialDiagnosisDetailResponse | null>(null);
  const [initialStep, setInitialStep] = useState(0);

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
  const [preventionAdvice, setPreventionAdvice] = useState<string | null>(null);
  const [diseaseNameMap, setDiseaseNameMap] = useState<Map<string, string>>(
    new Map(),
  );

  // -------- 处方状态 --------
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [aiPrescriptionSummary, setAiPrescriptionSummary] = useState<
    string | null
  >(null);
  const [initialMedications, setInitialMedications] = useState<
    MedicationDisplayItem[]
  >([]);
  const [initialCognitiveCards, setInitialCognitiveCards] = useState<
    CognitiveDisplayItem[]
  >([]);
  const [initialDietContent, setInitialDietContent] = useState('');
  const [initialExercises, setInitialExercises] = useState<
    ExerciseDisplayItem[]
  >([]);

  // -------- 候选项缓存 (js-cache-function-results) --------
  const candidateCache = useRef<CandidateCache | null>(null);

  // -------- H3: 仅加载候选项（resume 路径，不调用 LLM） --------
  const loadCandidatesOnly = useCallback(async () => {
    if (candidateCache.current) {
      setScaleItems(candidateCache.current.scales);
      setLabItems(candidateCache.current.labs);
      setImagingItems(candidateCache.current.imaging);
      return;
    }

    const [scaleRes, labRes, imagingRes] = await Promise.all([
      getDiagnosticScales({ limit: 100 }),
      getLabIndicators({ limit: 100 }),
      getImagingIndicators({ limit: 100 }),
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
      } catch {
        // 错误由调用方处理
      } finally {
        if (mountedRef.current) setScreeningLoading(false);
      }
    },
    [patientId, loadCandidatesOnly],
  );

  // -------- 加载疾病类型目录 --------
  const loadDiseaseTypes = useCallback(async () => {
    const diseaseRes = await getDiseaseTypes({ limit: 100 });
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
      setPreventionAdvice(result.prevention_advice ?? null);
    } catch {
      // 错误由调用方处理
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
        getMedicines({ limit: 100 }),
        getRehabLevels({ limit: 100 }),
      ]);

      if (!mountedRef.current) return;

      const medMap = new Map(medRes.data.items.map((m) => [m.id, m]));
      const rehabMap = new Map(rehabRes.data.items.map((r) => [r.id, r]));

      setInitialMedications(
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
          .filter((item): item is MedicationDisplayItem => item !== null),
      );

      setInitialCognitiveCards(
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
          .filter((item): item is CognitiveDisplayItem => item !== null),
      );

      setInitialDietContent(llmRes.diet_prescription ?? '');

      setInitialExercises(
        (llmRes.exercises ?? []).map((e, i) => ({
          id: `ex-${i}`,
          exerciseName: e.item,
          duration: `${e.quantity}${e.unit}`,
        })),
      );

      setAiPrescriptionSummary(llmRes.summary ?? null);
    } catch {
      // 错误由调用方处理
    } finally {
      if (mountedRef.current) setPrescriptionLoading(false);
    }
  }, [patientId]);

  // -------- H2: 从已保存 ID 解析处方显示数据 --------
  const resolvePrescriptionData = useCallback(
    async (data: InitialDiagnosisDetailResponse) => {
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
        hasMeds ? getMedicines({ limit: 100 }) : null,
        hasRehab ? getRehabLevels({ limit: 100 }) : null,
      ]);

      if (!mountedRef.current) return;

      if (medRes) {
        const medMap = new Map(medRes.data.items.map((m) => [m.id, m]));
        setInitialMedications(
          data.medicine_ids
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
            .filter((item): item is MedicationDisplayItem => item !== null),
        );
      }

      if (rehabRes) {
        const rehabMap = new Map(rehabRes.data.items.map((r) => [r.id, r]));
        setInitialCognitiveCards(
          data.rehab_level_ids
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
            .filter((item): item is CognitiveDisplayItem => item !== null),
        );
      }

      if (data.diet_plan) {
        setInitialDietContent(data.diet_plan);
      }

      if (data.exercise_plan?.length) {
        setInitialExercises(
          data.exercise_plan.map((e, i) => ({
            id: `ex-${i}`,
            exerciseName: e.name,
            duration: `${e.quantity}${e.unit}`,
          })),
        );
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
        // async-parallel: 患者信息 + 初诊数据
        const [patientRes, diagnosisRes] = await Promise.all([
          getPatient(patientId),
          getInitialDiagnosis(patientId),
        ]);

        if (!mountedRef.current) return;

        setPatientDetail(patientRes.data);
        setDiagnosisData(diagnosisRes.data);

        const step = computeCurrentStep(diagnosisRes.data);
        setInitialStep(step);

        const saved = diagnosisRes.data;

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
      } catch {
        // 网络错误由页面层处理
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

  return {
    initialLoading,
    patientDetail,
    diagnosisData,
    initialStep,

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
    loadPrescriptionData,
  };
}
