// 药物信息
export interface Medicine {
  id: string;
  treatment_type: string;
  name: string;
  image_url: string;
  efficacy: string;
  contraindications: string;
  creator_name: string | null;
  created_at: string;
}

// 列表查询参数
export interface MedicineListParams {
  offset?: number;
  limit?: number;
  treatment_type?: string;
  name?: string;
}

// 列表响应
export interface MedicineListResult {
  total: number;
  offset: number;
  limit: number;
  items: Medicine[];
}

// 创建请求
export interface MedicineCreateRequest {
  treatment_type: string;
  name: string;
  image_url: string;
  efficacy: string;
  contraindications: string;
}

// 更新请求
export interface MedicineUpdateRequest {
  treatment_type?: string;
  name?: string;
  image_url?: string;
  efficacy?: string;
  contraindications?: string;
}
