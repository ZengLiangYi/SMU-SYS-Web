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
  plan_time: string;
  duration_minutes: number;
  is_completed: boolean;
  created_at: string;
}

export interface FollowupCreateRequest {
  subject: string;
  plan_time: string;
  duration_minutes?: number;
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

/** @deprecated 使用 InternalReferralListResult / ExternalReferralListResult 代替 */
export interface ReferralListResult {
  internal: InternalReferralItem[];
  external: ExternalReferralItem[];
}

export interface InternalReferralListResult {
  total: number;
  offset: number;
  limit: number;
  items: InternalReferralItem[];
}

export interface ExternalReferralListResult {
  total: number;
  offset: number;
  limit: number;
  items: ExternalReferralItem[];
}

// -------- 创建转诊 --------
export interface PatientReferralCreateRequest {
  referral_type: 'internal' | 'external';
  referral_date: string;
  to_doctor_id?: string;
  hospital_id?: string;
  to_doctor_name?: string;
  to_doctor_phone?: string;
  note?: string;
  is_accepted?: boolean;
}

export interface PatientReferralCreateResponse {
  id: string;
  referral_type: 'internal' | 'external';
  patient_id: string;
  from_doctor_id: string;
  referral_date: string;
  to_doctor_id?: string;
  hospital_id?: string;
  to_doctor_name?: string;
  to_doctor_phone?: string;
  note?: string;
  is_accepted?: boolean;
}

// -------- 用药记录 --------
export interface MedicationRecordItem {
  id: string;
  medicine_name: string;
  medicine_image_url: string;
  taken_at: string;
  quantity: number | null;
  unit: string | null;
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

// -------- 健康指标记录 --------
export interface HealthMetricItem {
  id: string;
  systolic_pressure: number;
  diastolic_pressure: number;
  blood_glucose: number;
  blood_glucose_status: '空腹' | '餐后';
  total_cholesterol: number;
  triglycerides: number;
  hdl: number;
  ldl: number;
  measured_at: string;
}

export interface HealthMetricListParams {
  offset?: number;
  limit?: number;
}

export interface HealthMetricListResult {
  total: number;
  offset: number;
  limit: number;
  items: HealthMetricItem[];
}

// -------- 处方数据 --------
export interface PrescriptionMedicationItem {
  id: string;
  name: string;
  usage: string;
}

export interface PrescriptionCognitiveItem {
  id: string;
  name: string;
  levelType: string;
}

export interface PrescriptionExerciseItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface PrescriptionData {
  medications: PrescriptionMedicationItem[];
  cognitiveCards: PrescriptionCognitiveItem[];
  dietContent: string;
  exercises: PrescriptionExerciseItem[];
}

// -------- 康复评分记录 --------
export interface RehabScoreRecordListItem {
  id: string;
  evaluated_date: string;
  overall_score: number;
}

export interface RehabScoreRecordListParams {
  offset?: number;
  limit?: number;
}

export interface RehabScoreRecordListResult {
  total: number;
  offset: number;
  limit: number;
  items: RehabScoreRecordListItem[];
}

export interface RehabScoreRecordDetail {
  id: string;
  evaluated_date: string;
  medication_score: number;
  cognitive_training_score: number;
  diet_score: number;
  exercise_score: number;
  overall_score: number;
  advice: string;
}
