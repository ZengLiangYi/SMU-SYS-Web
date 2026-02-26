/**
 * ProTable request 通用工厂函数
 * 将 offset/limit 分页转换、错误处理统一封装，消除各页面重复代码
 */

type ListResult<T> = { total: number; items: T[] };

type ProTableRequestResult<T> = {
  data: T[];
  total: number;
  success: boolean;
};

export function createProTableRequest<T, P extends Record<string, any>>(
  apiFn: (params: P) => Promise<API.ApiResponse<ListResult<T>>>,
  buildParams?: (proParams: Record<string, any>) => Omit<P, 'offset' | 'limit'>,
): (params: Record<string, any>) => Promise<ProTableRequestResult<T>> {
  return async (params) => {
    const { current = 1, pageSize = 10, ...rest } = params;
    try {
      const apiParams = {
        offset: (current - 1) * pageSize,
        limit: pageSize,
        ...(buildParams ? buildParams(rest) : rest),
      } as unknown as P;
      const { data } = await apiFn(apiParams);
      return { data: data.items, total: data.total, success: true };
    } catch (error) {
      console.error('ProTable request failed:', error);
      return { data: [], total: 0, success: false };
    }
  };
}
