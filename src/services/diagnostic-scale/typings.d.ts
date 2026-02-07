// 诊断量表 - 列表项
export interface DiagnosticScale {
  id: string;
  name: string;
  image_url: string;
  primary_diseases: string[];
  introduction: string;
  estimated_duration: string;
  question_count: number;
  created_at: string;
}

// 诊断量表 - 详情（含题目列表）
export interface DiagnosticScaleDetail extends DiagnosticScale {
  questions: DiagnosticScaleQuestion[];
  updated_at: string;
}

// 诊断量表题目 - 响应体
export interface DiagnosticScaleQuestion {
  id: string;
  question_stem: string;
  question_content: string;
  score: number;
  question_type: string;
  scoring_rule: string;
  sort_order: number;
}

// 诊断量表题目 - 请求体（无 id / sort_order）
export interface DiagnosticScaleQuestionPayload {
  question_stem: string;
  question_content: string;
  score: number;
  question_type: string;
  scoring_rule: string;
}

// 列表查询参数
export interface DiagnosticScaleListParams {
  offset?: number;
  limit?: number;
}

// 列表响应
export interface DiagnosticScaleListResult {
  total: number;
  offset: number;
  limit: number;
  items: DiagnosticScale[];
}

// 创建请求（全部必填）
export interface DiagnosticScaleCreateRequest {
  name: string;
  image_url: string;
  primary_diseases: string[];
  introduction: string;
  estimated_duration: string;
  questions: DiagnosticScaleQuestionPayload[];
}

// 更新请求（全部可选）
export interface DiagnosticScaleUpdateRequest {
  name?: string;
  image_url?: string;
  primary_diseases?: string[];
  introduction?: string;
  estimated_duration?: string;
  questions?: DiagnosticScaleQuestionPayload[];
}
