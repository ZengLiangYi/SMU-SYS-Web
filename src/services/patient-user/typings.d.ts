export interface UserListItem {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  emergencyContact: string;
  diagnosisScore: number;
  prescriptionScore: number;
  category: string;
  status: number;
}

export interface UserListParams {
  name?: string;
  category?: string;
  current?: number;
  pageSize?: number;
}

// 用户详细信息
export interface UserDetailInfo {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  category: string;
  birthday: string;
  drinkingHabit: string;
  familyHistory: string;
  existingDisease: string;
  occupation: string;
  province: string;
  notDrugAllergy: string;
  lifeHabit: string;
  educationLevel: string;
  existingMedication: string;
  randomIntention: string;
  address: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  AIComprehensiveEfficacyEvaluationSuggestion: string;
  diagnosisScore: number;
  diagnosisScoreUpdateTime: string;
}

// 随访记录
export interface VisitRecord {
  id: string;
  date: string;
  doctor: string;
  topic: string;
  duration: string;
  status: number;
}

// 转诊记录（院内）
export interface TransferRecord {
  id: string;
  transferTime: string;
  transferOutDoctor: string;
  referralDoctor: string;
  note: string;
}

// 转诊记录（院外）
export interface OutTransferRecord {
  id: string;
  transferTime: string;
  transferHospital: string;
  referralDoctor: string;
  phone: string;
  hasReplyTransfer: string;
}

// 诊疗记录
export interface DiagnosisRecord {
  id: string;
  date: string;
  referralDoctor: string;
  diagnosisResult: string;
  rehabilitationPlan?: string; // 旧版文字处方（兼容）
  prescription?: {
    // 新版结构化处方
    medications: MedicationTreatment[];
    cognitiveCards: CognitiveTrainingCard[];
    dietContent: string;
    exercises: ExercisePrescription[];
  };
  status: number;
}

// 用药记录
export interface MedicationRecord {
  id: string;
  medicineName: string;
  medicineImage: string;
  usageTime: string;
  dosage: number;
  unit: string;
  status: number;
}

// 行为记录
export interface BehaviorRecord {
  id: string;
  behaviorDetail: string;
  status: number;
}

// 饮食记录
export interface DietRecord {
  id: string;
  time: string;
  image: string;
  note: string;
}

// 运动记录
export interface ExerciseRecord {
  id: string;
  behaviorDetail: string;
  status: number;
}

// 认知训练记录
export interface CognitiveTrainingRecord {
  id: string;
  trainingTime: string;
  trainingDuration: string;
  cardName: string;
  cardImage: string;
  cardCount: number;
  times: number;
  level: number;
  completionStatus: number;
}

// 评分历史记录
export interface ScoreHistoryRecord {
  id: string;
  date: string;
  comprehensiveScore: number;
}

// 药物治疗
export interface MedicationTreatment {
  id: string;
  medicineName: string;
  usage: string;
  dosage: string;
}

// 认知训练卡片
export interface CognitiveTrainingCard {
  id: string;
  cardName: string;
  difficulty: string;
}

// 饮食处方
export interface DietPrescription {
  content: string;
}

// 运动处方
export interface ExercisePrescription {
  id: string;
  exerciseName: string;
  duration: string;
}

