import { useRequest, useSearchParams } from '@umijs/max';
import { Card, Col, Empty, Result, Row, Segmented, Spin } from 'antd';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import React, { useCallback, useMemo } from 'react';
import { getPatientAnalysis, getScaleScores } from '@/services/patient-user';
import type { ScoreTrendPoint } from '@/services/patient-user/typings.d';

interface EffectEvaluationProps {
  patientId: string;
}

type Granularity = 'day' | 'week' | 'month';

const GRANULARITY_OPTIONS = [
  { label: '日', value: 'day' as const },
  { label: '周', value: 'week' as const },
  { label: '月', value: 'month' as const },
];

const VALID_GRANULARITIES = new Set<string>(['day', 'week', 'month']);

/** 趋势图字段 → 标题映射 */
const TREND_FIELDS: {
  key: keyof Omit<
    import('@/services/patient-user/typings.d').PatientHealthAnalysis,
    'granularity' | 'start_date' | 'end_date'
  >;
  title: string;
}[] = [
  { key: 'blood_pressure_score', title: '血压趋势分评估' },
  { key: 'blood_glucose_score', title: '血糖趋势分评估' },
  { key: 'blood_lipid_score', title: '血脂趋势分评估' },
  { key: 'diet_score', title: '饮食得分评估' },
  { key: 'exercise_score', title: '运动量得分' },
  { key: 'medication_adherence_score', title: '规律用药得分' },
  { key: 'composite_scale_score', title: '综合量表得分' },
  { key: 'overall_user_score', title: '用户综合得分' },
];

/** 生成折线趋势图 option */
function buildTrendOption(
  title: string,
  points: ScoreTrendPoint[],
): EChartsOption {
  const dates = points.map((p) => p.bucket_start);
  const values = points.map((p) => p.score);

  return {
    title: {
      text: title,
      left: 20,
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 600, color: '#000' },
    },
    grid: { left: 50, right: 30, top: 50, bottom: 30 },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { show: false },
      axisLabel: { color: '#999', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: { type: 'value', show: false },
    tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: false,
        itemStyle: {
          color: '#4ea0ff',
          borderColor: '#ffffff',
          borderWidth: 2,
        },
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
}

const EffectEvaluation: React.FC<EffectEvaluationProps> = ({ patientId }) => {
  // 粒度同步到 URL（deep-link all stateful UI）
  const [searchParams, setSearchParams] = useSearchParams();
  const rawGranularity = searchParams.get('granularity');
  const granularity: Granularity =
    rawGranularity && VALID_GRANULARITIES.has(rawGranularity)
      ? (rawGranularity as Granularity)
      : 'week';

  const handleGranularityChange = useCallback(
    (val: string | number) => {
      const next = new URLSearchParams(searchParams);
      next.set('granularity', String(val));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // 两个独立 useRequest，并行请求（async-parallel）
  const {
    data: analysisData,
    loading: analysisLoading,
    error: analysisError,
  } = useRequest(() => getPatientAnalysis(patientId, { granularity }), {
    refreshDeps: [patientId, granularity],
  });

  const {
    data: scaleData,
    loading: scaleLoading,
    error: scaleError,
  } = useRequest(() => getScaleScores(patientId), {
    refreshDeps: [patientId],
  });

  // useRequest 自动解包 ApiResponse，data 即为内层类型
  const analysis = analysisData;
  const scales = scaleData;

  // 量表柱状图 option（rerender-derived-state-no-effect: useMemo 派生）
  const scoreBarOption = useMemo<EChartsOption | null>(() => {
    if (!scales?.items?.length) return null;
    const items = scales.items;
    const names = items.map((i) => i.scale_name);
    const values = items.map((i) => i.score ?? 0);
    const avg =
      items.reduce((sum: number, i) => sum + (i.score ?? 0), 0) / items.length;

    return {
      title: {
        text: '量表得分评估',
        subtext: `所有量表平均得分 · ${Math.round(avg)}分`,
        left: 20,
        top: 20,
        textStyle: { fontSize: 13, fontWeight: 'normal', color: '#999' },
        subtextStyle: { fontSize: 14, fontWeight: 600, color: '#000' },
      },
      grid: { left: 60, right: 40, top: 80, bottom: 40 },
      xAxis: {
        type: 'category',
        data: names,
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
          data: values.map((v: number) => ({
            value: v,
            itemStyle: { borderRadius: 4, color: '#d6e4ff' },
          })),
          type: 'bar',
          barWidth: 32,
          emphasis: { itemStyle: { color: '#597ef7' } },
        },
      ],
    };
  }, [scales]);

  // 趋势图 options（rerender-derived-state-no-effect）
  const trendOptions = useMemo(() => {
    if (!analysis) return [];
    return TREND_FIELDS.map(({ key, title }) => {
      const points = analysis[key] as ScoreTrendPoint[];
      return {
        key,
        title,
        hasData: !!points?.length,
        option: points?.length ? buildTrendOption(title, points) : null,
      };
    });
  }, [analysis]);

  const isLoading = analysisLoading || scaleLoading;
  const hasError = !!analysisError || !!scaleError;

  if (isLoading) {
    return (
      <Spin style={{ display: 'block', padding: 80, textAlign: 'center' }} />
    );
  }

  if (hasError) {
    return (
      <Result
        status="warning"
        title="数据加载失败"
        subTitle="请检查网络连接后刷新页面重试"
      />
    );
  }

  if (!analysis && !scales) {
    return <Empty description="暂无评估数据" />;
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Segmented
          options={GRANULARITY_OPTIONS}
          value={granularity}
          onChange={handleGranularityChange}
        />
      </div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card size="small">
            {scoreBarOption ? (
              <ReactECharts option={scoreBarOption} style={{ height: 260 }} />
            ) : (
              <Empty
                description="暂无量表得分数据"
                style={{
                  height: 260,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              />
            )}
          </Card>
        </Col>
        {trendOptions.map(({ key, title, hasData, option }) => (
          <Col span={12} key={key}>
            <Card size="small">
              {hasData && option ? (
                <ReactECharts option={option} style={{ height: 260 }} />
              ) : (
                <Empty
                  description={`暂无${title}数据`}
                  style={{
                    height: 260,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default EffectEvaluation;
