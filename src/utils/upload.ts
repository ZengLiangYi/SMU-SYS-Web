import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import React from 'react';
import { getStaticUrl } from '@/services/static';

/**
 * Upload picture-card 的默认占位按钮（模块级常量，避免每次渲染重建）
 *
 * @example
 * ```tsx
 * <Upload listType="picture-card">
 *   {fileList.length >= 1 ? null : uploadCardButton}
 * </Upload>
 * ```
 */
export const uploadCardButton: React.ReactNode = React.createElement(
  'div',
  null,
  React.createElement(PlusOutlined),
  React.createElement('div', { style: { marginTop: 8 } }, '上传图片'),
);

/** 上传配置选项 */
interface UploadOptions {
  /** 资源子目录 */
  dir?: string;
  /** 允许的文件类型（MIME type），如 'image/*' */
  accept?: string;
  /** 最大文件数量 */
  maxCount?: number;
}

/**
 * 获取上传组件通用配置
 * @param options 上传配置选项
 * @returns Ant Design Upload 组件 props
 *
 * @example
 * ```tsx
 * <Upload {...getUploadProps({ dir: 'avatars' })} />
 * ```
 */
export function getUploadProps(options?: UploadOptions): UploadProps {
  let token: string | null = null;
  try {
    token = localStorage.getItem('access_token');
  } catch {
    // localStorage 可能在某些环境下不可用
  }

  return {
    action: '/api/system/static/upload',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    data: options?.dir ? { dir: options.dir } : undefined,
    accept: options?.accept,
    maxCount: options?.maxCount,
  };
}

/**
 * 从上传响应中提取文件 URL
 * @param file Ant Design UploadFile 对象
 * @returns 文件访问 URL
 */
export function getFileUrl(file: UploadFile): string {
  // 已上传成功的文件从 response 获取（url 已是完整路径）
  if (file.response?.data?.url) {
    return file.response.data.url;
  }

  // 本地预览使用 thumbUrl 或 url
  return file.thumbUrl || file.url || '';
}

/**
 * 将服务器返回的 URL 转换为 UploadFile 格式
 * @param url 服务器返回的资源 URL
 * @param name 文件名（可选）
 * @returns Ant Design UploadFile 对象
 */
export function urlToUploadFile(url: string, name?: string): UploadFile {
  const fullUrl = getStaticUrl(url);
  return {
    uid: url,
    name: name || url.split('/').pop() || 'file',
    status: 'done',
    url: fullUrl,
    thumbUrl: fullUrl,
  };
}
