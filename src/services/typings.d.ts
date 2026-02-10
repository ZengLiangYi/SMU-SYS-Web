/**
 * 全局 API 类型定义
 * 仅包含跨模块复用的通用类型
 */
declare namespace API {
  // 统一响应结构
  type ApiResponse<T> = {
    status: string;
    msg: string;
    data: T;
  };

  // 医生用户（被 auth、doctor-admin 等多模块复用）
  type DoctorUser = {
    id: string;
    code: string;
    name: string;
    phone: string;
  };

  // 当前用户（全局用户状态）
  type CurrentUser = {
    id?: string;
    name?: string;
    code?: string;
    phone?: string;
    avatar?: string;
    role: 'doctor' | 'admin';
  };
}
