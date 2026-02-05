import { request } from '@umijs/max';

/**
 * 上传静态资源
 * @param params { file: 上传文件, dir?: 资源子目录 }
 */
export async function uploadStatic(params: StaticAPI.UploadParams) {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.dir) {
    formData.append('dir', params.dir);
  }

  return request<API.ApiResponse<StaticAPI.UploadResult>>(
    '/api/system/static/upload',
    { method: 'POST', data: formData },
  );
}

const STATIC_PREFIX = '/api/system/static/';

/**
 * 获取静态资源完整 URL
 * @param path 资源路径（支持相对路径、完整路径或完整 URL）
 * @returns 完整的静态资源访问 URL
 */
export function getStaticUrl(path: string): string {
  // 早返回：空值
  if (!path) return '';

  // 早返回：已是完整 URL
  if (path.startsWith('http')) return path;

  // 早返回：已包含 API 前缀（幂等性）
  if (path.startsWith(STATIC_PREFIX)) return path;

  // 处理路径格式
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${STATIC_PREFIX}${cleanPath}`;
}
