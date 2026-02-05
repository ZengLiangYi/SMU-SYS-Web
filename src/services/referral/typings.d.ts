// 转诊医生
export interface Referral {
  id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_phone: string;
  doctor_name: string;
  title: string;
  contact: string;
}

// 列表查询参数
export interface ReferralListParams {
  offset?: number;
  limit?: number;
  hospital_name?: string;
  doctor_name?: string;
}

// 列表响应
export interface ReferralListResult {
  total: number;
  offset: number;
  limit: number;
  items: Referral[];
}

// 创建请求
export interface ReferralCreateRequest {
  hospital_name: string;
  hospital_address: string;
  hospital_phone: string;
  doctor_name: string;
  title: string;
  contact: string;
}

// 更新请求
export interface ReferralUpdateRequest {
  hospital_name?: string;
  hospital_address?: string;
  hospital_phone?: string;
  doctor_name?: string;
  title?: string;
  contact?: string;
}
