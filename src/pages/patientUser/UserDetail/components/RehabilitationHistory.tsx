import { EyeOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Typography } from 'antd';
import React from 'react';

// 本地类型定义（暂无对应 API，保留 mock 数据）
interface ScoreHistoryRecord {
  id: string;
  date: string;
  comprehensiveScore: number;
}

import useComponentStyles from './components.style';

const { Title } = Typography;

const RehabilitationHistory: React.FC = () => {
  const { styles } = useComponentStyles();

  const getComprehensiveScore = () => {
    return 88.8;
  };

  const getMedicationScore = () => {
    return [
      {
        name: '用药',
        score: 95,
      },
      {
        name: '认知',
        score: 75,
      },
      {
        name: '饮食',
        score: 60,
      },
      {
        name: '运动',
        score: 40,
      },
    ];
  };

  // 获取评分历史记录数据
  const getScoreHistoryRecords = (): ScoreHistoryRecord[] => {
    return [
      {
        id: '1',
        date: '1997/04/17',
        comprehensiveScore: 88.88,
      },
      {
        id: '2',
        date: '2001/05/26',
        comprehensiveScore: 88.88,
      },
      {
        id: '3',
        date: '1995/02/02',
        comprehensiveScore: 88.88,
      },
      {
        id: '4',
        date: '1983/09/11',
        comprehensiveScore: 88.88,
      },
      {
        id: '5',
        date: '1977/10/25',
        comprehensiveScore: 88.88,
      },
    ];
  };

  // 评分历史记录列定义
  const scoreHistoryColumns: ProColumns<ScoreHistoryRecord>[] = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 200,
    },
    {
      title: '综合评分',
      dataIndex: 'comprehensiveScore',
      width: 200,
    },
    {
      title: '按钮',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => console.log('查看详情:', record)}
        >
          详情
        </Button>
      ),
    },
  ];

  // 获取评分历史记录
  const fetchScoreHistoryRecords = async () => {
    const mockData = getScoreHistoryRecords();
    return {
      data: mockData,
      success: true,
      total: mockData.length,
    };
  };
  return (
    <div className={styles.tabContent}>
      <div className={styles.infoSection}>
        <div className={styles.scoreVisualizationContainer}>
          <div className={styles.scoreVisualizationLeft}>
            <div className={styles.scoreSummaryDisplay}>
              <div className={styles.scoreSummaryLabel}>综合评分：</div>
              <div className={styles.scoreSummaryValue}>
                {getComprehensiveScore()}
              </div>
            </div>
            <div className={styles.scoreCharts}>
              <div className={styles.scoreChartItem}>
                <div className={styles.chartLabel}>用药</div>
                <div className={styles.chartBarContainer}>
                  <div
                    className={styles.chartBar}
                    style={{
                      width: `${getMedicationScore()[0].score}%`,
                      background: '#5b8ff9',
                    }}
                  />
                </div>
              </div>
              <div className={styles.scoreChartItem}>
                <div className={styles.chartLabel}>认知</div>
                <div className={styles.chartBarContainer}>
                  <div
                    className={styles.chartBar}
                    style={{
                      width: `${getMedicationScore()[1].score}%`,
                      background: '#b799ff',
                    }}
                  />
                </div>
              </div>
              <div className={styles.scoreChartItem}>
                <div className={styles.chartLabel}>饮食</div>
                <div className={styles.chartBarContainer}>
                  <div
                    className={styles.chartBar}
                    style={{
                      width: `${getMedicationScore()[2].score}%`,
                      background: '#a44cff',
                    }}
                  />
                </div>
              </div>
              <div className={styles.scoreChartItem}>
                <div className={styles.chartLabel}>运动</div>
                <div className={styles.chartBarContainer}>
                  <div
                    className={styles.chartBar}
                    style={{
                      width: `${getMedicationScore()[3].score}%`,
                      background: '#b8d4ff',
                    }}
                  />
                </div>
              </div>
              <div className={styles.chartScales}>
                <span className={styles.chartScale} style={{ left: 0 }}>
                  0
                </span>
                <span className={styles.chartScale} style={{ left: '20%' }}>
                  20
                </span>
                <span className={styles.chartScale} style={{ left: '40%' }}>
                  40
                </span>
                <span className={styles.chartScale} style={{ left: '60%' }}>
                  60
                </span>
                <span className={styles.chartScale} style={{ left: '80%' }}>
                  80
                </span>
                <span className={styles.chartScale} style={{ left: '100%' }}>
                  100
                </span>
              </div>
            </div>
          </div>
          <div className={styles.scoreVisualizationRight}>
            <div className={styles.scoreRecommendationBox}>
              <div className={styles.scoreRecommendationTitle}>日建议：</div>
              <div className={styles.scoreRecommendationContent}>
                建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            评分历史
          </Title>
        </div>
        <ProTable<ScoreHistoryRecord>
          rowKey="id"
          search={false}
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          request={fetchScoreHistoryRecords}
          columns={scoreHistoryColumns}
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
    </div>
  );
};

export default RehabilitationHistory;
