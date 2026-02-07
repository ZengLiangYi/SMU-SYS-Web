import { Card, Col, Row } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';

// TODO: 替换为后端 API 接口
const MOCK_SCORE_DATA = [
  { name: '量表1', value: 95 },
  { name: '量表2', value: 72 },
  { name: '量表3', value: 80 },
  { name: '量表4', value: 77 },
  { name: '量表5', value: 88 },
  { name: '量表6', value: 70 },
  { name: '量表7', value: 85 },
];

const comprehensiveScoreOption = {
  title: {
    text: '量表得分评估',
    subtext: '所有量表平均得分 · 82分',
    left: 20,
    top: 20,
    textStyle: { fontSize: 13, fontWeight: 'normal', color: '#999' },
    subtextStyle: { fontSize: 14, fontWeight: 600, color: '#000' },
  },
  grid: { left: 60, right: 40, top: 80, bottom: 40 },
  xAxis: {
    type: 'category',
    data: MOCK_SCORE_DATA.map((item) => item.name),
    axisLine: { lineStyle: { color: '#e0e0e0' } },
    axisLabel: { color: '#666', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    max: 100,
    splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } },
    axisLabel: { color: '#666', fontSize: 11 },
  },
  tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
  series: [
    {
      data: MOCK_SCORE_DATA.map((item) => ({
        value: item.value,
        itemStyle: { borderRadius: 4, color: '#d6e4ff' },
      })),
      type: 'bar',
      barWidth: 32,
      emphasis: { itemStyle: { color: '#597ef7' } },
    },
  ],
};

// 趋势图配置生成
const getTrendOption = (category: string, title: string) => {
  const months = ['一周', '二周', '三周', '四周', '五周'];
  // TODO: 替换为后端 API 接口
  const data = months.map(() => 75 + Math.round((Math.random() - 0.5) * 20));

  return {
    title: {
      text: category,
      subtext: title,
      left: 20,
      top: 10,
      textStyle: { fontSize: 11, fontWeight: 'normal', color: '#999' },
      subtextStyle: { fontSize: 14, fontWeight: 600, color: '#000' },
    },
    grid: { left: 50, right: 30, top: 60, bottom: 30 },
    xAxis: {
      type: 'category',
      data: months,
      boundaryGap: false,
      axisLine: { show: false },
      axisLabel: { color: '#999', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: { type: 'value', show: false },
    tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
    series: [
      {
        data,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: false,
        itemStyle: { color: '#4ea0ff', borderColor: '#ffffff', borderWidth: 2 },
        lineStyle: { color: '#4ea0ff', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(78, 160, 255, 0.3)' },
              { offset: 0.3, color: 'rgba(78, 160, 255, 0.05)' },
              { offset: 1, color: 'rgba(78, 160, 255, 0.0)' },
            ],
          },
        },
      },
    ],
  };
};

const TREND_CHARTS = [
  { category: '血压趋势分评估', title: '血压得分评估' },
  { category: '血糖趋势分评估', title: '血糖得分评估' },
  { category: '血脂趋势分评估', title: '血脂得分评估' },
  { category: '饮食得分评估', title: '饮食得分评估' },
  { category: '运动量得分', title: '运动量得分' },
  { category: '提供用药得分', title: '提供用药得分' },
  { category: '认知训练得分', title: '认知训练得分' },
  { category: '认知训练得分评估', title: '认知训练得分评估' },
  { category: '用户日常合规分评估', title: '用户日常合规分评估' },
];

const EffectEvaluation: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card size="small">
          <ReactECharts
            option={comprehensiveScoreOption}
            style={{ height: 260 }}
          />
        </Card>
      </Col>
      {TREND_CHARTS.map((chart) => (
        <Col span={12} key={chart.category}>
          <Card size="small">
            <ReactECharts
              option={getTrendOption(chart.category, chart.title)}
              style={{ height: 260 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EffectEvaluation;
