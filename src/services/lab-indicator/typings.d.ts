// 实验室筛查指标
export interface LabIndicator {
  id: string;
  name: string;
  inspection_item: string;
  analysis_suggestion: string;
  notes: string;
  action_guidance: string;
  created_at: string;
}

// 列表查询参数
export interface LabIndicatorListParams {
  offset?: number;
  limit?: number;
}

// 列表响应
export interface LabIndicatorListResult {
  total: number;
  offset: number;
  limit: number;
  items: LabIndicator[];
}

// 创建请求
export interface LabIndicatorCreateRequest {
  name: string;
  inspection_item: string;
  analysis_suggestion: string;
  notes: string;
  action_guidance: string;
}

// 元数据条目（轻量，仅 id + name）
export interface LabIndicatorMetaItem {
  id: string;
  name: string;
}

// 更新请求
export interface LabIndicatorUpdateRequest {
  name?: string;
  inspection_item?: string;
  analysis_suggestion?: string;
  notes?: string;
  action_guidance?: string;
}
