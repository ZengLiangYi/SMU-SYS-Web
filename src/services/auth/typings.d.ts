// 刷新 token 请求
export interface RefreshRequest {
  refresh_token: string;
}

// 医生登录响应
export interface DoctorLoginResult {
  access_token: string;
  refresh_token: string;
  user: API.DoctorUser;
}

// 医生刷新响应
export interface DoctorRefreshResult {
  access_token: string;
  refresh_token: string;
}

// 管理端登录/刷新响应
export interface AdminLoginResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

// 更新医生个人资料请求
export interface DoctorProfileUpdateRequest {
  code?: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
}

// 修改医生密码请求
export interface DoctorPasswordChangeRequest {
  old_password: string;
  new_password: string;
}
