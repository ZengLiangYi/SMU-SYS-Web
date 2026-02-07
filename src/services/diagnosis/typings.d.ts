// -------- 筛查项目 --------
export interface ScreeningItem {
  id: string;
  name: string;
  note: string;
}

export interface ScreeningItems {
  筛查量表: ScreeningItem[];
  实验室检查: ScreeningItem[];
  影像学检查: ScreeningItem[];
}

// -------- 运动处方条目 --------
export interface ExercisePlanItem {
  name: string;
  quantity: number;
  unit: string;
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
