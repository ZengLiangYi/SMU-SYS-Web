// 疾病类型
export interface DiseaseType {
  id: string;
  disease_category: string;
  disease_name: string;
  manifestations: string;
  rehab_recommendation: string;
  created_by_doctor_name: string | null;
  created_at: string;
  updated_at?: string;
}

// 列表查询参数
export interface DiseaseTypeListParams {
  offset?: number;
  limit?: number;
  disease_category?: string;
  disease_name?: string;
}

// 列表响应
export interface DiseaseTypeListResult {
  total: number;
  offset: number;
  limit: number;
  items: DiseaseType[];
}

// 创建请求
export interface DiseaseTypeCreateRequest {
  disease_category: string;
  disease_name: string;
  manifestations: string;
  rehab_recommendation: string;
}

// 更新请求
export interface DiseaseTypeUpdateRequest {
  disease_category?: string;
  disease_name?: string;
  manifestations?: string;
  rehab_recommendation?: string;
}
