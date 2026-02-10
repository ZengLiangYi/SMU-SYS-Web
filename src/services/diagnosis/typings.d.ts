// -------- 筛查项目（仅 ID 数组，per OpenAPI spec） --------
export interface ScreeningItems {
  selected_assessments?: string[];
  selected_lab_tests?: string[];
  selected_imaging_tests?: string[];
}

// -------- 运动处方条目 --------
export interface ExercisePlanItem {
  name: string;
  quantity: number;
  unit: string;
}

// -------- 初诊全量信息（GET 响应，支持断点续诊） --------
export interface InitialDiagnosisDetailResponse {
  patient_id: string;
  doctor_id: string | null;
  diagnosis_status: string | null;
  completed_at: string | null;
  chief_complaint: string | null;
  physical_signs: string | null;
  present_illness: string | null;
  screening_items: ScreeningItems | null;
  examination_steps: string | null;
  lab_result_url: string | null;
  imaging_result_url: string | null;
  diagnosis_results: string[];
  diagnosis_note: string | null;
  medicine_ids: string[];
  rehab_level_ids: string[];
  exercise_plan: ExercisePlanItem[];
  diet_plan: string | null;
}

// -------- 初诊更新请求（支持分步提交） --------
export interface InitialDiagnosisUpdateRequest {
  chief_complaint?: string;
  physical_signs?: string;
  present_illness?: string;
  screening_items?: ScreeningItems;
  examination_steps?: string;
  lab_result_url?: string;
  imaging_result_url?: string;
  diagnosis_results?: string[];
  diagnosis_note?: string;
  medicine_ids?: string[];
  rehab_level_ids?: string[];
  exercise_plan?: ExercisePlanItem[];
  diet_plan?: string;
}

// -------- 诊疗列表 --------
export interface DiagnosisRecordListItem {
  prescription_id: string | null;
  patient_id: string;
  initial_diagnosis_date: string | null;
  patient_name: string;
  categories: string[];
  doctor_name: string | null;
  diagnosis_results: string[];
  prescription_summary: string | null;
}

export interface DiagnosisRecordListParams {
  offset?: number;
  limit?: number;
  category?: string;
  patient_name?: string;
  doctor_name?: string;
}

export interface DiagnosisRecordListResult {
  total: number;
  offset: number;
  limit: number;
  items: DiagnosisRecordListItem[];
}
