/**
 * 静态资源服务类型定义
 */
declare namespace StaticAPI {
  /** 上传响应数据 */
  type UploadResult = {
    /** 资源访问 URL */
    url: string;
    /** 资源相对路径（相对 www） */
    path: string;
    /** 服务器保存的文件名 */
    filename: string;
    /** 上传时的原始文件名 */
    original_name: string;
    /** 文件大小（字节） */
    size: number;
  };

  /** 上传请求参数 */
  type UploadParams = {
    /** 上传文件 */
    file: File;
    /** 资源子目录（可选，自动归入 uploads 下） */
    dir?: string;
  };
}
