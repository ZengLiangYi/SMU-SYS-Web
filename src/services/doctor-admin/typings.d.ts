// 医生账号分页查询参数
export interface DoctorUserListParams {
  offset?: number;
  limit?: number;
  name?: string;
  code?: string;
}

// 医生账号分页列表响应
export interface DoctorUserListResult {
  total: number;
  offset: number;
  limit: number;
  items: API.DoctorUser[];
}

// 创建医生账号请求
export interface DoctorUserCreateRequest {
  code: string;
  name: string;
  phone: string;
}

// 更新医生账号请求
export interface DoctorUserUpdateRequest {
  code?: string;
  name?: string;
  phone?: string;
  password?: string;
}
