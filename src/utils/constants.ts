/**
 * 人群分类枚举（与后端 PatientCategory 保持一致）
 */
export const CROWD_CATEGORY = {
  NORMAL: '认知正常人员',
  SCD_WARNING: 'SCD 人群（预警期）',
  MCI_CONTROL: 'MCI 人群（预控期）',
  SUSPICIOUS: '可疑认知障碍患者',
  HIGH_RISK: '高危险人群',
  DIAGNOSED: '已确诊患者',
};

/**
 * 人群分类选项列表（ProFormSelect 使用）
 */
export const CROWD_CATEGORY_OPTIONS = Object.values(CROWD_CATEGORY).map(
  (value) => ({ label: value, value }),
);

/**
 * 人群分类 valueEnum（ProTable 列筛选使用）
 */
export const CROWD_CATEGORY_ENUM = Object.fromEntries(
  Object.values(CROWD_CATEGORY).map((value) => [value, { text: value }]),
);

/**
 * 获取人群分类对应的颜色
 * @param category 人群分类
 * @returns 颜色值
 */
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    [CROWD_CATEGORY.NORMAL]: '#68cf50',
    [CROWD_CATEGORY.SCD_WARNING]: '#FFA500', // 橙色
    [CROWD_CATEGORY.MCI_CONTROL]: '#FFA500', // 橙色
    [CROWD_CATEGORY.SUSPICIOUS]: '#FFA500', // 橙色
    [CROWD_CATEGORY.HIGH_RISK]: '#FF0000', // 红色
    [CROWD_CATEGORY.DIAGNOSED]: '#906aca', // 紫色
  };
  return colorMap[category] || 'default';
};

/**
 * 获取状态对应的颜色
 * @param status 状态
 * @returns 颜色值
 */
export const getStatusColor = (status: number): string => {
  return status === 1 ? '#336fff' : '#ff4d4f';
};

export const getTimeFormat = (time: string): string => {
  const date = new Date(time);
  return `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
};

/**
 * 量表题目类型 → 中文标签映射
 */
export const QUESTION_TYPE_LABELS: Record<string, string> = {
  single_choice: '选择',
  fill_blank: '填空',
  true_false: '判断',
};

/**
 * 量表题目类型选项列表（ProFormSelect 使用）
 */
export const QUESTION_TYPE_OPTIONS = [
  { label: '选择题', value: 'single_choice' },
  { label: '填空题', value: 'fill_blank' },
  { label: '判断题', value: 'true_false' },
];

/**
 * 需要显示选项编辑器的题目类型集合
 */
export const TYPES_WITH_OPTIONS = new Set(['single_choice', 'true_false']);

/**
 * 选项自动编号字母序列（A-Z）
 */
export const OPTION_KEY_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * 判断题固定选项（API 规范: key 为 'True'/'False'）
 */
export const TRUE_FALSE_DEFAULT_OPTIONS = [
  { key: 'True', label: '是', score: 0 },
  { key: 'False', label: '否', score: 0 },
];

/**
 * 单选题默认选项
 */
export const SINGLE_CHOICE_DEFAULT_OPTIONS = [
  { key: 'A', label: '', score: 0 },
  { key: 'B', label: '', score: 0 },
];

/**
 * 获取量表题目类型对应的颜色
 * @param type 题目类型（支持英文枚举值或中文标签）
 * @returns 颜色值
 */
export const getScaleTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    single_choice: '#336fff',
    true_false: '#68cf50',
    fill_blank: '#de7bb4',
  };
  return colorMap[type] || 'default';
};

/**
 * 获取功能支持对应的颜色
 * @param feature 功能名称
 * @returns 颜色值
 */
export const getFeatureColor = (feature: string): string => {
  const colorMap: Record<string, string> = {
    录音: '#ff4d4f',
    图片: '#906aca',
    视频: '#ffa500',
    语音: '#68cf50',
    文字: '#336fff',
  };
  return colorMap[feature] || 'default';
};

/**
 * 康复训练关卡类型
 */
export const REHAB_LEVEL_TYPES = [
  { label: '复合注意', value: '复合注意' },
  { label: '学习记忆', value: '学习记忆' },
  { label: '执行抑制', value: '执行抑制' },
  { label: '语言言语', value: '语言言语' },
  { label: '知觉运动', value: '知觉运动' },
  { label: '社会认知', value: '社会认知' },
] as const;

/**
 * 康复训练关卡类型 - ProTable valueEnum 格式
 */
export const REHAB_LEVEL_TYPE_ENUM = Object.fromEntries(
  REHAB_LEVEL_TYPES.map(({ value }) => [value, { text: value }]),
);

/**
 * 通知业务类型 → 跳转路由映射
 * 按需填充，key 为后端返回的 biz_type，value 为接收 biz_id 并返回路由路径的函数
 */
export const NOTIFICATION_BIZ_ROUTE_MAP: Record<
  string,
  (bizId: string, extra?: Record<string, any> | null) => string
> = {
  // 患者同意/拒绝绑定 → 跳转到患者详情（patient_id 在 extra 中）
  bind_request_result: (_bizId, extra) =>
    `/patient-user/detail/${extra?.patient_id ?? ''}`,
};
