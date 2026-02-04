import { EyeOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import type { ScoreHistoryRecord } from '@/services/patient-user/typings';

const RehabilitationHistory: React.FC = () => {
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
        <Space className="action-items">
          <div
            className="action-item"
            onClick={() => console.log('查看详情:', record)}
          >
            <EyeOutlined />
            <span>详情</span>
          </div>
        </Space>
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
    <div className="tab-content">
      <div className="info-section">
        <div className="score-visualization-container">
          <div className="score-visualization-left">
            <div className="score-summary-display">
              <div className="score-summary-label">综合评分：</div>
              <div className="score-summary-value">
                {getComprehensiveScore()}
              </div>
            </div>
            <div className="score-charts">
              <div className="score-chart-item">
                <div className="chart-label">用药</div>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${getMedicationScore()[0].score}%`,
                      background: '#5b8ff9',
                    }}
                  ></div>
                </div>
              </div>
              <div className="score-chart-item">
                <div className="chart-label">认知</div>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${getMedicationScore()[1].score}%`,
                      background: '#b799ff',
                    }}
                  ></div>
                </div>
              </div>
              <div className="score-chart-item">
                <div className="chart-label">饮食</div>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${getMedicationScore()[2].score}%`,
                      background: '#a44cff',
                    }}
                  ></div>
                </div>
              </div>
              <div className="score-chart-item">
                <div className="chart-label">运动</div>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${getMedicationScore()[3].score}%`,
                      background: '#b8d4ff',
                    }}
                  ></div>
                </div>
              </div>
              <div className="chart-scales">
                <span className="chart-scale scale-0">0</span>
                <span className="chart-scale scale-20">20</span>
                <span className="chart-scale scale-40">40</span>
                <span className="chart-scale scale-60">60</span>
                <span className="chart-scale scale-80">80</span>
                <span className="chart-scale scale-100">100</span>
              </div>
            </div>
          </div>
          <div className="score-visualization-right">
            <div className="score-recommendation-box">
              <div className="score-recommendation-title">日建议：</div>
              <div className="score-recommendation-content">
                建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">评分历史</h3>
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
          className="score-history-table"
        />
      </div>
    </div>
  );
};

export default RehabilitationHistory;
