import { EyeOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Typography,
} from 'antd';
import React from 'react';

const { Title, Text } = Typography;

// -------- 本地类型定义（暂无对应 API） --------
interface ScoreHistoryRecord {
  id: string;
  date: string;
  comprehensiveScore: number;
}

// TODO: 替换为后端 API 接口
const MOCK_COMPREHENSIVE_SCORE = 88.8;

const MOCK_CATEGORY_SCORES = [
  { name: '用药', score: 95, color: '#5b8ff9' },
  { name: '认知', score: 75, color: '#b799ff' },
  { name: '饮食', score: 60, color: '#a44cff' },
  { name: '运动', score: 40, color: '#b8d4ff' },
];

const MOCK_SCORE_HISTORY: ScoreHistoryRecord[] = [
  { id: '1', date: '1997/04/17', comprehensiveScore: 88.88 },
  { id: '2', date: '2001/05/26', comprehensiveScore: 88.88 },
  { id: '3', date: '1995/02/02', comprehensiveScore: 88.88 },
  { id: '4', date: '1983/09/11', comprehensiveScore: 88.88 },
  { id: '5', date: '1977/10/25', comprehensiveScore: 88.88 },
];

const scoreHistoryColumns: ProColumns<ScoreHistoryRecord>[] = [
  { title: '日期', dataIndex: 'date', width: 200 },
  { title: '综合评分', dataIndex: 'comprehensiveScore', width: 200 },
  {
    title: '操作',
    key: 'action',
    width: 150,
    render: () => (
      <Button type="link" size="small" icon={<EyeOutlined />}>
        详情
      </Button>
    ),
  },
];

const RehabilitationHistory: React.FC = () => {
  return (
    <div>
      {/* -------- 评分可视化 -------- */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Flex align="baseline" gap={8} style={{ marginBottom: 16 }}>
              <Text strong>综合评分：</Text>
              <Text strong style={{ fontSize: 36 }}>
                {MOCK_COMPREHENSIVE_SCORE}
              </Text>
            </Flex>
            {MOCK_CATEGORY_SCORES.map((item) => (
              <Flex
                key={item.name}
                align="center"
                gap={12}
                style={{ marginBottom: 12 }}
              >
                <Text
                  type="secondary"
                  style={{ minWidth: 40, textAlign: 'right' }}
                >
                  {item.name}
                </Text>
                <Progress
                  percent={item.score}
                  showInfo={false}
                  strokeColor={item.color}
                  style={{ flex: 1, margin: 0 }}
                />
              </Flex>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Alert
            type="warning"
            message="日建议"
            description="建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容建议内容"
            showIcon
            style={{ height: '100%' }}
          />
        </Col>
      </Row>

      {/* -------- 评分历史表格 -------- */}
      <Title level={5}>评分历史</Title>
      <ProTable<ScoreHistoryRecord>
        rowKey="id"
        search={false}
        options={false}
        request={async () => ({
          data: MOCK_SCORE_HISTORY,
          success: true,
          total: MOCK_SCORE_HISTORY.length,
        })}
        columns={scoreHistoryColumns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RehabilitationHistory;
