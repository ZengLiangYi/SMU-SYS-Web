import { CheckCard } from '@ant-design/pro-components';
import { Alert, Flex, Spin, Tag, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

export interface ScreeningCheckItem {
  id: string;
  name: string;
  note: string;
}

interface AICheckContentProps {
  loading?: boolean;
  scaleItems: ScreeningCheckItem[];
  labItems: ScreeningCheckItem[];
  imagingItems: ScreeningCheckItem[];
  selectedScaleIds: string[];
  selectedLabIds: string[];
  selectedImagingIds: string[];
  onScaleChange: (ids: string[]) => void;
  onLabChange: (ids: string[]) => void;
  onImagingChange: (ids: string[]) => void;
  aiSuggestion: string | null;
  confidence: number | null;
}

const AICheckContent: React.FC<AICheckContentProps> = ({
  loading,
  scaleItems,
  labItems,
  imagingItems,
  selectedScaleIds,
  selectedLabIds,
  selectedImagingIds,
  onScaleChange,
  onLabChange,
  onImagingChange,
  aiSuggestion,
  confidence,
}) => {
  if (loading) {
    return (
      <Spin
        description="AI 正在分析中，大约需要 1-2 分钟…"
        style={{ display: 'block', padding: 60, textAlign: 'center' }}
      />
    );
  }

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Text type="secondary">基于患者信息及候选项目生成，医生可调整勾选</Text>
        {/* M2: ternary not && */}
        {confidence != null ? (
          <Tag color="blue" style={{ fontVariantNumeric: 'tabular-nums' }}>
            置信度 {(confidence * 100).toFixed(0)}%
          </Tag>
        ) : null}
      </Flex>

      {/* 量表评估 */}
      {scaleItems.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <Title level={5} style={{ marginBottom: 10 }}>
            量表评估
          </Title>
          <CheckCard.Group
            multiple
            value={selectedScaleIds}
            onChange={(val) => onScaleChange(val as string[])}
            size="small"
          >
            {scaleItems.map((item) => (
              <CheckCard
                key={item.id}
                value={item.id}
                title={item.name}
                description={item.note || undefined}
                style={{ width: 200 }}
              />
            ))}
          </CheckCard.Group>
        </div>
      ) : null}

      {/* 实验室筛查 */}
      {labItems.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <Title level={5} style={{ marginBottom: 10 }}>
            实验室筛查
          </Title>
          <CheckCard.Group
            multiple
            value={selectedLabIds}
            onChange={(val) => onLabChange(val as string[])}
            size="small"
          >
            {labItems.map((item) => (
              <CheckCard
                key={item.id}
                value={item.id}
                title={item.name}
                description={item.note || undefined}
                style={{ width: 200 }}
              />
            ))}
          </CheckCard.Group>
        </div>
      ) : null}

      {/* 影像学检测 */}
      {imagingItems.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <Title level={5} style={{ marginBottom: 10 }}>
            影像学检测
          </Title>
          <CheckCard.Group
            multiple
            value={selectedImagingIds}
            onChange={(val) => onImagingChange(val as string[])}
            size="small"
          >
            {imagingItems.map((item) => (
              <CheckCard
                key={item.id}
                value={item.id}
                title={item.name}
                description={item.note || undefined}
                style={{ width: 200 }}
              />
            ))}
          </CheckCard.Group>
        </div>
      ) : null}

      {/* AI 建议 */}
      {aiSuggestion ? (
        <Alert
          type="info"
          showIcon
          title="AI 建议"
          description={aiSuggestion}
          style={{ marginTop: 16 }}
        />
      ) : null}
    </div>
  );
};

export default AICheckContent;
