/**
 * 全局 API 类型定义
 * 包含认证相关的通用类型
 */
declare namespace API {
  // 统一响应结构
  type ApiResponse<T> = {
    status: string;
    msg: string;
    data: T;
  };

  // 医生用户
  type DoctorUser = {
    id: string;
    code: string;
    name: string;
  };

  // 医生登录响应
  type DoctorLoginResult = {
    access_token: string;
    user: DoctorUser;
  };

  // 管理端登录响应
  type AdminLoginResult = {
    access_token: string;
    expires_in: number;
  };

  // 当前用户
  type CurrentUser = {
    id?: string;
    name?: string;
    code?: string;
    avatar?: string;
    role: 'doctor' | 'admin';
  };
}
