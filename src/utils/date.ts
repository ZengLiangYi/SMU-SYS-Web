import dayjs from 'dayjs';

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

/**
 * 格式化 UTC 时间为相对时间字符串（如 "3分钟前"）
 * @param utcDateStr UTC 时间字符串
 * @returns 相对时间字符串，如果无效则返回 '-'
 * @example formatTimeAgoUTC('2026-02-09T10:00:00Z') => '5分钟前'
 */
export function formatTimeAgoUTC(
  utcDateStr: string | null | undefined,
): string {
  if (!utcDateStr) return '-';
  // 先解析日期字符串（识别其中的时区），然后转换为 UTC
  const date = dayjs(utcDateStr).utc();
  if (!date.isValid()) return '-';
  return date.fromNow();
}

/**
 * 计算 UTC 时间距离现在的分钟数
 * @param utcDateStr UTC 时间字符串
 * @returns 距离现在的分钟数，如果无效则返回 Infinity
 * @example getMinutesAgoUTC('2026-02-09T10:00:00Z') => 5
 */
export function getMinutesAgoUTC(
  utcDateStr: string | null | undefined,
): number {
  if (!utcDateStr) return Infinity;
  // 先解析日期字符串（识别其中的时区），然后转换为 UTC 进行比较
  const created = dayjs(utcDateStr).utc();
  if (!created.isValid()) return Infinity;
  const now = dayjs().utc();
  return now.diff(created, 'minute');
}

/**
 * 判断 UTC 时间是否在指定分钟数内
 * @param utcDateStr UTC 时间字符串
 * @param minutes 分钟数
 * @returns 是否在指定时间内
 * @example isWithinMinutesUTC('2026-02-09T10:00:00Z', 2) => true（如果在2分钟内）
 */
export function isWithinMinutesUTC(
  utcDateStr: string | null | undefined,
  minutes: number,
): boolean {
  return getMinutesAgoUTC(utcDateStr) < minutes;
}
