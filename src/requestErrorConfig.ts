import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  // Legacy format
  success?: boolean;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
  // New API format (API.ApiResponse)
  status?: string;
  msg?: string;
  // Shared
  data: any;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType, status, msg } =
        res as unknown as ResponseStructure;

      // Check both formats: legacy (!success) and new (status !== 'OK')
      const isError =
        success === false || (status !== undefined && status !== 'OK');

      if (isError) {
        const error: any = new Error(errorMessage || msg || '请求失败');
        error.name = 'BizError';
        error.info = {
          errorCode,
          errorMessage: errorMessage || msg,
          showType,
          data,
        };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器 - 添加 Bearer Token
  requestInterceptors: [
    (config: RequestOptions) => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      } catch {
        // localStorage 可能在某些环境下不可用
      }
      return config;
    },
  ],

  // 响应拦截器 - 处理 401 和业务错误
  responseInterceptors: [
    (response) => {
      // 401 处理：清除 token 并跳转登录
      if (response.status === 401) {
        try {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_role');
          localStorage.removeItem('currentUser');
        } catch {
          // localStorage 可能在某些环境下不可用
        }
        window.location.href = '/user/login';
        return response;
      }

      // 拦截响应数据，进行个性化处理
      // Check both legacy and new API response formats
      const { data } = response as unknown as ResponseStructure;
      const isError =
        data?.success === false ||
        (data?.status !== undefined && data?.status !== 'OK');

      if (isError) {
        message.error(data?.msg || data?.errorMessage || '请求失败！');
      }
      return response;
    },
  ],
};
