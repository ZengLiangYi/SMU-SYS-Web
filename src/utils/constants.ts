/**
 * 人群分类枚举
 */
export const CROWD_CATEGORY = {
  NORMAL: '认知正常人员',
  SCD_WARNING: 'SCD人群（预警期）',
  MCI_CONTROL: 'MCI人群（预控期）',
  SUSPICIOUS: '可疑认知障碍患者',
  HIGH_RISK: '高危险人群',
  DIAGNOSED: '已确诊患者',
};

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
 * 获取量表题目类型对应的颜色
 * @param type 题目类型
 * @returns 颜色值
 */
export const getScaleTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    单选题: '#336fff',
    判断题: '#68cf50',
    简答题: '#ffa500',
    画图: '#906aca',
    多选题: '#5cbebf',
    填空题: '#de7bb4',
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
