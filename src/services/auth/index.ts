import { request } from '@umijs/max';

/**
 * 医生登录
 * @param params { code: 医生工号, password: 密码 }
 */
export async function doctorLogin(params: { code: string; password: string }) {
  return request<API.ApiResponse<API.DoctorLoginResult>>(
    '/api/doctor/auth/login',
    { method: 'POST', data: params },
  );
}

/**
 * 管理端登录
 * @param params { password: 管理端密码 }
 */
export async function adminLogin(params: { password: string }) {
  return request<API.ApiResponse<API.AdminLoginResult>>(
    '/api/doctor-admin/auth/login',
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
 * 根据角色调用不同的登出接口
 */
export async function logout() {
  const role = localStorage.getItem('user_role');
  const endpoint =
    role === 'admin'
      ? '/api/doctor-admin/auth/logout'
      : '/api/doctor/auth/logout';
  return request(endpoint, { method: 'POST' });
}
