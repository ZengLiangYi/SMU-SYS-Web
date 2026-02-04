import ReactECharts from 'echarts-for-react';
import React from 'react';
import useComponentStyles from './components.style';

interface EffectEvaluationProps {
  aiSuggestion: string;
}

const EffectEvaluation: React.FC<EffectEvaluationProps> = ({
  aiSuggestion: _aiSuggestion,
}) => {
  const { styles } = useComponentStyles();
  // 综合评分数据
  const getComprehensiveScoreData = () => {
    return [
      { name: '量表1', value: 95 },
      { name: '量表2', value: 72 },
      { name: '量表3', value: 80 },
      { name: '量表4', value: 77 },
      { name: '量表5', value: 88 },
      { name: '量表6', value: 70 },
      { name: '量表7', value: 85 },
    ];
  };

  // 综合评分柱状图配置
  const comprehensiveScoreOption = {
    title: {
      text: '量表得分评估',
      subtext: '所有量表平均得分 · 82分',
      left: 20,
      top: 20,
      textStyle: {
        fontSize: 13,
        fontWeight: 'normal',
        color: '#999',
      },
      subtextStyle: {
        fontSize: 14,
        fontWeight: 600,
        color: '#000',
      },
    },
    grid: {
      left: 60,
      right: 40,
      top: 80,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      data: getComprehensiveScoreData().map((item) => item.name),
      axisLine: {
        lineStyle: {
          color: '#e0e0e0',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 11,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#000',
      borderColor: '#000',
      borderRadius: 4,
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      axisPointer: {
        type: 'none',
      },
    },
    series: [
      {
        data: getComprehensiveScoreData().map((item) => ({
          value: item.value,
          itemStyle: {
            borderRadius: 4,
            color: '#d6e4ff',
          },
        })),
        type: 'bar',
        barWidth: 32,
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            color: '#597ef7', // 鼠标悬停时的颜色
          },
        },
      },
    ],
  };

  // 趋势图数据生成函数
  const getTrendData = (baseValue: number, variance: number = 10) => {
    const months = ['一周', '二周', '三周', '四周', '五周'];
    const data = months.map(
      () => baseValue + Math.round((Math.random() - 0.5) * variance * 2),
    );
    // 在三周位置添加标记点
    return {
      months,
      data,
      markIndex: 2, // 三周
    };
  };

  // 生成趋势图配置
  const getTrendOption = (category: string, title: string) => {
    const trendData = getTrendData(75, 10);

    return {
      title: {
        text: category,
        subtext: title,
        left: 20,
        top: 10,
        textStyle: {
          fontSize: 11,
          fontWeight: 'normal',
          color: '#999',
        },
        subtextStyle: {
          fontSize: 14,
          fontWeight: 600,
          color: '#000',
        },
      },
      grid: {
        left: 50,
        right: 30,
        top: 60,
        bottom: 30,
      },
      xAxis: {
        type: 'category',
        data: trendData.months,
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: '#999',
          fontSize: 10,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#000',
        borderColor: '#000',
        borderRadius: 4,
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        axisPointer: {
          type: 'none',
        },
      },
      series: [
        {
          data: trendData.data,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 10,
          showSymbol: false,
          itemStyle: {
            normal: {
              color: '#4ea0ff',
              borderColor: '#ffffff',
              borderWidth: 2,
            },
          },
          lineStyle: {
            color: '#4ea0ff',
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(78, 160, 255, 0.3)',
                },
                {
                  offset: 0.3,
                  color: 'rgba(78, 160, 255, 0.05)',
                },
                {
                  offset: 1,
                  color: 'rgba(78, 160, 255, 0.0)',
                },
              ],
            },
          },
        },
      ],
    };
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.infoSection}>
        <div>
          {/* 分项评分趋势图 */}
          <div className={styles.trendChartsGrid}>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={comprehensiveScoreOption}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('血压趋势分评估', '血压得分评估')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('血糖趋势分评估', '血糖得分评估')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('血脂趋势分评估', '血脂得分评估')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('饮食得分评估', '饮食得分评估')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('运动量得分', '运动量得分')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('提供用药得分', '提供用药得分')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('认知训练得分', '认知训练得分')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption('认知训练得分评估', '认知训练得分评估')}
                style={{ height: '260px' }}
              />
            </div>
            <div className={styles.trendChartItem}>
              <ReactECharts
                option={getTrendOption(
                  '用户日常合规分评估',
                  '用户日常合规分评估',
                )}
                style={{ height: '260px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectEvaluation;
