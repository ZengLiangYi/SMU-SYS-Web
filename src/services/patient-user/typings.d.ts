// -------- 患者列表项 --------
export interface PatientListItem {
  id: string;
  name: string;
  gender: string;
  age: number;
  contact_name: string | null;
  treatment_score: number | null;
  prescription_daily_score: number | null;
  categories: string[];
  diagnosis_status: string | null;
}

// -------- 患者列表查询参数 --------
export interface PatientListParams {
  offset?: number;
  limit?: number;
  is_bound?: boolean; // 是否查询已绑定患者（默认 true）
}

// -------- 患者列表响应 --------
export interface PatientListResult {
  total: number;
  offset: number;
  limit: number;
  items: PatientListItem[];
}

// -------- 患者联系人 --------
export interface PatientContact {
  name: string;
  relation: string;
  phone: string;
}

// -------- 患者详情 --------
export interface PatientDetail {
  id: string;
  doctor_id: string | null;
  phone: string;
  name: string;
  gender: string;
  age: number;
  birth_date: string;
  categories: string[];
  diet_habits: string | null;
  lifestyle_habits: string | null;
  family_history: string | null;
  education_level: string | null;
  medical_history: string | null;
  medication_history: string | null;
  occupation: string | null;
  followup_willing: boolean | null;
  native_place: string | null;
  address: string | null;
  bad_habits: string | null;
  contacts: PatientContact[];
}

// -------- 更新患者请求 --------
export interface PatientUpdateRequest {
  name?: string;
  gender?: string;
  phone?: string;
  birth_date?: string;
  categories?: string[];
  diet_habits?: string | null;
  lifestyle_habits?: string | null;
  family_history?: string | null;
  education_level?: string | null;
  medical_history?: string | null;
  medication_history?: string | null;
  occupation?: string | null;
  followup_willing?: boolean | null;
  native_place?: string | null;
  address?: string | null;
  bad_habits?: string | null;
  contacts?: PatientContact[] | null;
}

// -------- 随访记录 --------
export interface FollowupListItem {
  id: string;
  doctor_name: string | null;
  subject: string;
  duration_minutes: number;
  is_completed: boolean;
  created_at: string;
}

export interface FollowupListParams {
  offset?: number;
  limit?: number;
}

export interface FollowupListResult {
  total: number;
  offset: number;
  limit: number;
  items: FollowupListItem[];
}

// -------- 转诊记录 --------
export interface InternalReferralItem {
  id: string;
  referral_date: string;
  from_doctor_name: string | null;
  to_doctor_name: string | null;
  note: string | null;
}

export interface ExternalReferralItem {
  id: string;
  referral_date: string;
  from_doctor_name: string | null;
  hospital_name: string | null;
  to_doctor_name: string | null;
  to_doctor_phone: string | null;
  is_accepted: boolean;
}

export interface ReferralListResult {
  internal: InternalReferralItem[];
  external: ExternalReferralItem[];
}

// -------- 用药记录 --------
export interface MedicationRecordItem {
  id: string;
  medicine_name: string;
  medicine_image_url: string;
  taken_at: string;
  quantity: number;
  unit: string;
}

export interface MedicationRecordListParams {
  offset?: number;
  limit?: number;
}

export interface MedicationRecordListResult {
  total: number;
  offset: number;
  limit: number;
  items: MedicationRecordItem[];
}

// -------- 饮食记录 --------
export interface DietRecordItem {
  id: string;
  meal_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  image_url: string;
}

export interface DietRecordListParams {
  offset?: number;
  limit?: number;
}

export interface DietRecordListResult {
  total: number;
  offset: number;
  limit: number;
  items: DietRecordItem[];
}

// -------- 运动记录 --------
export interface ExerciseRecordItem {
  id: string;
  activity_name: string;
  quantity: number;
  unit: string;
  exercised_at: string;
}

export interface ExerciseRecordListParams {
  offset?: number;
  limit?: number;
}

export interface ExerciseRecordListResult {
  total: number;
  offset: number;
  limit: number;
  items: ExerciseRecordItem[];
}

// -------- 健康分析 --------
export interface ScoreTrendPoint {
  bucket_start: string;
  score: number;
}

export interface PatientHealthAnalysis {
  granularity: 'day' | 'week' | 'month';
  start_date: string;
  end_date: string;
  blood_pressure_score: ScoreTrendPoint[];
  blood_glucose_score: ScoreTrendPoint[];
  blood_lipid_score: ScoreTrendPoint[];
  diet_score: ScoreTrendPoint[];
  exercise_score: ScoreTrendPoint[];
  medication_adherence_score: ScoreTrendPoint[];
  composite_scale_score: ScoreTrendPoint[];
  overall_user_score: ScoreTrendPoint[];
}

export interface PatientAnalysisParams {
  granularity?: 'day' | 'week' | 'month';
  start_date?: string;
  end_date?: string;
}

// -------- 量表分数 --------
export interface ScaleScoreItem {
  scale_id: string;
  scale_name: string;
  score: number | null;
}

export interface ScaleScoreResult {
  items: ScaleScoreItem[];
}
