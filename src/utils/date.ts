import dayjs from 'dayjs';

/**
 * 后端约定：所有时间戳为服务器本地时间 + "GMT" 后缀（RFC 2822 格式）。
 * 计算相对时间时需要去掉 "GMT"，让 Date 按本地时间解析，
 * 否则 new Date("...GMT") 会按 UTC 解析，导致 epoch 偏移 8 小时。
 */
function stripTimezone(dateStr: string): string {
  return dateStr.replace(/\s*GMT\s*$/i, '');
}

/**
 * 格式化日期时间（显示时间数值本身，不做时区转换）
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

/**
 * 格式化时间为相对时间字符串（如 "3分钟前"）
 *
 * 去掉 "GMT" 后缀再解析，使 epoch 基于本地时区，
 * 与 dayjs() 的本地 "now" 对比时差值正确。
 */
export function formatTimeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = dayjs(stripTimezone(dateStr));
  if (!date.isValid()) return '-';
  return date.fromNow();
}

/**
 * 计算时间距离现在的分钟数
 * @returns 距离现在的分钟数，如果无效则返回 Infinity
 */
export function getMinutesAgo(dateStr: string | null | undefined): number {
  if (!dateStr) return Infinity;
  const created = dayjs(stripTimezone(dateStr));
  if (!created.isValid()) return Infinity;
  return dayjs().diff(created, 'minute');
}

/**
 * 判断时间是否在指定分钟数内
 */
export function isWithinMinutes(
  dateStr: string | null | undefined,
  minutes: number,
): boolean {
  return getMinutesAgo(dateStr) < minutes;
}
