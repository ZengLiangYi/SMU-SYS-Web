import { request } from '@umijs/max';
import type {
  AdminLoginResult,
  DoctorLoginResult,
  DoctorRefreshResult,
  RefreshRequest,
} from './typings.d';

/**
 * 医生登录
 * @param params { code: 医生工号, password: 密码 }
 */
export async function doctorLogin(params: { code: string; password: string }) {
  return request<API.ApiResponse<DoctorLoginResult>>(
    '/api/doctor/auth/login',
    { method: 'POST', data: params },
  );
}

/**
 * 管理端登录
 * @param params { password: 管理端密码 }
 */
export async function adminLogin(params: { password: string }) {
  return request<API.ApiResponse<AdminLoginResult>>(
    '/api/doctor-admin/auth/login',
    { method: 'POST', data: params },
  );
}

/**
 * 医生刷新 token
 * @param params { refresh_token: 刷新令牌 }
 */
export async function doctorRefreshToken(params: RefreshRequest) {
  return request<API.ApiResponse<DoctorRefreshResult>>(
    '/api/doctor/auth/refresh',
    { method: 'POST', data: params },
  );
}

/**
 * 管理端刷新 token
 * @param params { refresh_token: 刷新令牌 }
 */
export async function adminRefreshToken(params: RefreshRequest) {
  return request<API.ApiResponse<AdminLoginResult>>(
    '/api/doctor-admin/auth/refresh',
    { method: 'POST', data: params },
  );
}

/**
 * 获取当前医生信息
 */
export async function getDoctorMe() {
  return request<API.ApiResponse<API.DoctorUser>>('/api/doctor/me');
}

/**
 * 登出
 * 根据角色调用不同的登出接口，同时吊销 refresh_token
 */
export async function logout() {
  try {
    const role = localStorage.getItem('user_role');
    const refreshToken = localStorage.getItem('refresh_token');
    const endpoint =
      role === 'admin'
        ? '/api/doctor-admin/auth/logout'
        : '/api/doctor/auth/logout';

    return request(endpoint, {
      method: 'POST',
      data: refreshToken ? { refresh_token: refreshToken } : undefined,
    });
  } catch {
    // localStorage 可能在某些环境下不可用
    return request('/api/doctor/auth/logout', { method: 'POST' });
  }
}
