// 康复训练关卡
export interface RehabLevel {
  id: string;
  level_type: string;
  name: string;
  image_url: string;
  description: string;
  level_range: string;
  created_at: string;
  updated_at?: string;
}

// 列表查询参数
export interface RehabLevelListParams {
  offset?: number;
  limit?: number;
  level_type?: string;
  name?: string;
}

// 列表响应
export interface RehabLevelListResult {
  total: number;
  offset: number;
  limit: number;
  items: RehabLevel[];
}

// 创建请求
export interface RehabLevelCreateRequest {
  level_type: string;
  name: string;
  image_url: string;
  description: string;
  level_range: string;
}

// 更新请求
export interface RehabLevelUpdateRequest {
  level_type?: string;
  name?: string;
  image_url?: string;
  description?: string;
  level_range?: string;
}
