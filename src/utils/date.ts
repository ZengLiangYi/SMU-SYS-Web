/**
 * 格式化日期时间（保持 UTC 时区，不做本地转换）
 * @param dateStr 日期字符串（如 "Thu, 05 Feb 2026 15:23:39 GMT"）
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(
  dateStr: string | undefined | null,
  options?: {
    /** 是否显示时间，默认 true */
    showTime?: boolean;
    /** 是否显示秒，默认 false */
    showSeconds?: boolean;
  },
): string {
  if (!dateStr) return '-';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const { showTime = true, showSeconds = false } = options ?? {};

    const formatOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    };

    if (showTime) {
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
      if (showSeconds) {
        formatOptions.second = '2-digit';
      }
    }

    return new Intl.DateTimeFormat('zh-CN', formatOptions).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * 格式化日期（仅日期，不含时间）
 * @param dateStr 日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateStr: string | undefined | null): string {
  return formatDateTime(dateStr, { showTime: false });
}
