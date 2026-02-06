// 影像学筛查指标
export interface ImagingIndicator {
  id: string;
  name: string;
  inspection_item: string;
  analysis_suggestion: string;
  notes: string;
  action_guidance: string;
  created_at: string;
}

// 列表查询参数
export interface ImagingIndicatorListParams {
  offset?: number;
  limit?: number;
}

// 列表响应
export interface ImagingIndicatorListResult {
  total: number;
  offset: number;
  limit: number;
  items: ImagingIndicator[];
}

// 创建请求
export interface ImagingIndicatorCreateRequest {
  name: string;
  inspection_item: string;
  analysis_suggestion: string;
  notes: string;
  action_guidance: string;
}

// 更新请求
export interface ImagingIndicatorUpdateRequest {
  name?: string;
  inspection_item?: string;
  analysis_suggestion?: string;
  notes?: string;
  action_guidance?: string;
}
