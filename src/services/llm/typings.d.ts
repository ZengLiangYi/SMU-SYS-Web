import type { ScreeningItems } from '../diagnosis/typings.d';

// -------- 筛查项目推荐 --------
export interface LlmScreeningRequest {
  uuid: string;
  chief_complaint: string;
  present_illness: string;
  physical_signs: string;
  screening_items: ScreeningItems;
}

export interface LlmScreeningResponse {
  selected_assessments: string[];
  selected_lab_tests: string[];
  selected_imaging_tests: string[];
  examination_steps: string | null;
  prediction_confidence: number;
}

// -------- 病症判断 --------
export interface LlmDiseaseJudgementRequest {
  uuid: string;
  screening_items: string[];
}

export interface PrimaryDisease {
  disease_id: string;
  confidence: number;
  reason: string;
}

export interface OtherPossibleDisease {
  disease_id: string;
  reason: string;
}

export interface LlmDiseaseJudgementResponse {
  primary_disease: PrimaryDisease | null;
  other_possible_diseases: OtherPossibleDisease[];
}

// -------- 处方生成 --------
export interface LlmPrescriptionRequest {
  uuid: string;
}

export interface LlmPrescriptionExerciseItem {
  item: string;
  quantity: number;
  unit: string;
}

export interface LlmPrescriptionResponse {
  medicines: string[];
  trainings: string[];
  diet_prescription: string;
  exercises: LlmPrescriptionExerciseItem[];
  summary: string;
}
