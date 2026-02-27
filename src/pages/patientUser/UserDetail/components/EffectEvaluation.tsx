import { ProDescriptions } from '@ant-design/pro-components';
import { useRequest, useSearchParams } from '@umijs/max';
import {
  App,
  Card,
  Col,
  Empty,
  Flex,
  List,
  Modal,
  Result,
  Row,
  Segmented,
  Spin,
  Tag,
  Typography,
} from 'antd';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import React, { useCallback, useMemo, useState } from 'react';
import {
  getPatientAnalysis,
  getScaleScores,
  getScaleTestDetail,
} from '@/services/patient-user';
import type {
  NullableScoreTrendPoint,
  ScaleTestAnswerDetailItem,
  ScaleTestRecordDetail,
  ScoreTrendPoint,
} from '@/services/patient-user/typings.d';
import { formatDateTime } from '@/utils/date';

const { Text } = Typography;

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

/** 题型中文映射 */
const QUESTION_TYPE_LABEL: Record<string, string> = {
  single_choice: '单选题',
  fill_blank: '填空题',
  short_answer: '简答题',
  true_false: '判断题',
};

// rerender-memo-with-default-value: 提升常量 style 对象
const CHART_CONTAINER_STYLE = { height: 260 } as const;

/** 生成折线趋势图 option（支持 nullable score，ECharts 原生处理 null 断线） */
function buildTrendOption(
  title: string,
  points: (ScoreTrendPoint | NullableScoreTrendPoint)[],
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
  const { message } = App.useApp();

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

  // 量表详情 Modal 状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingDetail, setViewingDetail] =
    useState<ScaleTestRecordDetail | null>(null);

  // 两个独立 useRequest，并行请求（async-parallel）
  // rerender-simple-expression-in-memo: 直接解构命名，无冗余 alias
  const {
    data: analysis,
    loading: analysisLoading,
    error: analysisError,
  } = useRequest(() => getPatientAnalysis(patientId, { granularity }), {
    refreshDeps: [patientId, granularity],
  });

  const {
    data: scales,
    loading: scaleLoading,
    error: scaleError,
  } = useRequest(() => getScaleScores(patientId), {
    refreshDeps: [patientId],
  });

  // 量表详情手动请求（与 RehabilitationHistory 一致）
  const { run: runFetchDetail } = useRequest(
    (recordId: string) => getScaleTestDetail(patientId, recordId),
    {
      manual: true,
      onSuccess: (res) => {
        setViewingDetail(res);
        setDetailModalVisible(true);
      },
      onError: () => {
        message.error('获取量表详情失败');
      },
    },
  );

  // 柱状图点击事件：点击柱子 → 打开对应量表的作答详情
  const handleBarClick = useCallback(
    (params: { dataIndex: number }) => {
      const item = scales?.items?.[params.dataIndex];
      if (!item?.record_id) {
        message.warning('该量表暂无作答详情');
        return;
      }
      runFetchDetail(item.record_id);
    },
    [scales, runFetchDetail, message],
  );

  // 量表柱状图 option（rerender-derived-state-no-effect: useMemo 派生）
  const scoreBarOption = useMemo<EChartsOption | null>(() => {
    if (!scales?.items?.length) return null;
    const items = scales.items;

    // js-combine-iterations: 合并遍历为单次
    const names: string[] = [];
    const values: number[] = [];
    for (const i of items) {
      names.push(i.scale_name);
      values.push(i.score ?? 0);
    }

    return {
      title: {
        text: '量表得分评估',
        left: 20,
        top: 20,
        textStyle: { fontSize: 14, fontWeight: 600, color: '#000' },
      },
      grid: { left: 40, right: 40, top: 60, bottom: 40 },
      xAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' },
        formatter: (params: unknown) => {
          const p = Array.isArray(params) ? params[0] : params;
          const { name } = p as { name: string };
          return `${name}<br/><span style="color:#999;font-size:11px">点击查看详情</span>`;
        },
      },
      series: [
        {
          data: values.map((v: number) => ({
            value: v,
            itemStyle: { borderRadius: 4, color: '#d6e4ff' },
          })),
          type: 'bar',
          barWidth: 32,
          cursor: 'pointer',
          emphasis: { itemStyle: { color: '#597ef7' } },
        },
      ],
    };
  }, [scales]);

  // 趋势图 options（rerender-derived-state-no-effect）
  const trendOptions = useMemo(() => {
    if (!analysis) return [];
    return TREND_FIELDS.map(({ key, title }) => {
      const points = analysis[key] as (
        | ScoreTrendPoint
        | NullableScoreTrendPoint
      )[];
      return {
        key,
        title,
        hasData: !!points?.length,
        option: points?.length ? buildTrendOption(title, points) : null,
      };
    });
  }, [analysis]);

  // rerender-derived-state-no-effect + js-tosorted-immutable: 题目排序 useMemo 派生
  const sortedDetailItems = useMemo(
    () =>
      viewingDetail?.items?.toSorted((a, b) => a.sort_order - b.sort_order) ??
      [],
    [viewingDetail],
  );

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
        {/* 量表柱状图（可点击柱子查看作答详情） */}
        <Col span={12}>
          <Card size="small">
            {scoreBarOption ? (
              <ReactECharts
                option={scoreBarOption}
                style={CHART_CONTAINER_STYLE}
                onEvents={{ click: handleBarClick }}
              />
            ) : (
              <Flex vertical justify="center" style={CHART_CONTAINER_STYLE}>
                <Empty description="暂无量表得分数据" />
              </Flex>
            )}
          </Card>
        </Col>

        {/* 趋势图 */}
        {trendOptions.map(({ key, title, hasData, option }) => (
          <Col span={12} key={key}>
            <Card size="small">
              {hasData && option ? (
                <ReactECharts option={option} style={CHART_CONTAINER_STYLE} />
              ) : (
                <Flex vertical justify="center" style={CHART_CONTAINER_STYLE}>
                  <Empty description={`暂无${title}数据`} />
                </Flex>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* 量表作答详情 Modal */}
      <Modal
        title={viewingDetail?.scale_name ?? '量表详情'}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        {viewingDetail ? (
          <>
            <ProDescriptions<ScaleTestRecordDetail>
              column={2}
              dataSource={viewingDetail}
              columns={[
                {
                  title: '总分',
                  dataIndex: 'score',
                },
                {
                  title: '作答时间',
                  dataIndex: 'tested_at',
                  render: (_, record) => formatDateTime(record.tested_at),
                },
              ]}
            />
            <List<ScaleTestAnswerDetailItem>
              dataSource={sortedDetailItems}
              renderItem={(item, index) => (
                <List.Item key={item.question_id}>
                  <Card
                    size="small"
                    style={{ width: '100%' }}
                    title={
                      <Flex align="center" gap={8}>
                        <Text type="secondary">{index + 1}.</Text>
                        <Text>{item.question_stem}</Text>
                        <Tag>
                          {QUESTION_TYPE_LABEL[item.question_type] ??
                            item.question_type}
                        </Tag>
                      </Flex>
                    }
                    extra={<Tag color="blue">{item.awarded_score}分</Tag>}
                  >
                    {item.question_content?.options?.length > 0 ? (
                      <Flex vertical gap={4}>
                        {item.question_content.options.map((opt) => {
                          const isSelected = item.user_answers?.includes(
                            opt.key,
                          );
                          return (
                            <Text
                              key={opt.key}
                              type={isSelected ? undefined : 'secondary'}
                              strong={isSelected}
                            >
                              {isSelected ? '● ' : '○ '}
                              {opt.key}. {opt.label}
                            </Text>
                          );
                        })}
                      </Flex>
                    ) : (
                      <Text type="secondary">
                        答案：{item.user_answers?.join('、') || '-'}
                      </Text>
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </>
        ) : (
          <Spin
            style={{ display: 'block', textAlign: 'center', padding: 40 }}
          />
        )}
      </Modal>
    </>
  );
};

export default EffectEvaluation;
