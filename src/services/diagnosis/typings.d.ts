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

// -------- 当前诊疗详情（GET 响应，支持断点续诊） --------
export interface DiagnosisDetailResponse {
  diagnosis_id: string | null;
  patient_id: string;
  doctor_id: string | null;
  diagnosis_status: string | null;
  created_at: string | null;
  completed_at: string | null;
  chief_complaint: string | null;
  physical_signs: string | null;
  present_illness: string | null;
  screening_items: ScreeningItems | null;
  examination_steps: string | null;
  lab_result_images: Record<string, string> | null;
  blood_routine_url: string | null;
  imaging_result_images: Record<string, string> | null;
  diagnosis_results: string[];
  diagnosis_note: string | null;
  medicine_ids: string[];
  rehab_level_ids: string[];
  exercise_plan: ExercisePlanItem[];
  diet_plan: string | null;
  prescription_summary: string | null;
  unfinished_scale_ids: string[];
}

// -------- 诊疗更新请求（支持分步提交） --------
export interface DiagnosisUpdateRequest {
  chief_complaint?: string;
  physical_signs?: string;
  present_illness?: string;
  screening_items?: ScreeningItems;
  examination_steps?: string;
  lab_result_images?: Record<string, string>;
  imaging_result_images?: Record<string, string>;
  diagnosis_results?: string[];
  diagnosis_note?: string;
  medicine_ids?: string[];
  rehab_level_ids?: string[];
  exercise_plan?: ExercisePlanItem[];
  diet_plan?: string;
  prescription_summary?: string;
}

// -------- 创建诊疗记录响应 --------
export interface DiagnosisCreateResponse {
  diagnosis_id: string;
}

// -------- 诊疗历史 --------
export interface DiagnosisHistoryItem {
  diagnosis_id: string;
  doctor_id: string | null;
  created_at: string;
  completed_at: string | null;
  diagnosis_results: string[];
}

export interface DiagnosisHistoryParams {
  offset?: number;
  limit?: number;
}

export interface DiagnosisHistoryResult {
  total: number;
  offset: number;
  limit: number;
  items: DiagnosisHistoryItem[];
}

// -------- 已完成诊疗列表 --------
export interface DiagnosisRecordListItem {
  prescription_id: string | null;
  patient_id: string;
  diagnosis_date: string | null;
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
