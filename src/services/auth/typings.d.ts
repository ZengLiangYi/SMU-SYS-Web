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
