import { request } from '@umijs/max';
import type {
  DoctorUserListParams,
  DoctorUserListResult,
  DoctorUserCreateRequest,
  DoctorUserUpdateRequest,
} from './typings.d';

/**
 * 分页查询医生账号
 * @param params { offset: 偏移量, limit: 分页大小 }
 */
export async function getDoctorUsers(params: DoctorUserListParams) {
  return request<API.ApiResponse<DoctorUserListResult>>(
    '/api/doctor-admin/users',
    { method: 'GET', params },
  );
}

/**
 * 创建医生账号
 * @param data { code: 工号, name: 姓名 }
 */
export async function createDoctorUser(data: DoctorUserCreateRequest) {
  return request<API.ApiResponse<API.DoctorUser>>(
    '/api/doctor-admin/users',
    { method: 'POST', data },
  );
}

/**
 * 更新医生账号
 * @param userId 医生账号 ID
 * @param data { code?: 工号, name?: 姓名 }
 */
export async function updateDoctorUser(
  userId: string,
  data: DoctorUserUpdateRequest,
) {
  return request<API.ApiResponse<API.DoctorUser>>(
    `/api/doctor-admin/users/${userId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 删除医生账号
 * @param userId 医生账号 ID
 */
export async function deleteDoctorUser(userId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor-admin/users/${userId}`,
    { method: 'DELETE' },
  );
}
