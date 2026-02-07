import { CheckCard } from '@ant-design/pro-components';
import { Alert, Flex, Spin, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const { Text } = Typography;

const useStyles = createStyles(({ token }) => ({
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    color: token.colorTextHeading,
  },
  confidenceBadge: {
    fontVariantNumeric: 'tabular-nums',
  },
}));

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
  const { styles } = useStyles();

  if (loading) {
    return (
      <Spin
        tip="AI 正在分析中…"
        style={{ display: 'block', padding: 60, textAlign: 'center' }}
      />
    );
  }

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Text type="secondary">基于患者信息及候选项目生成，医生可调整勾选</Text>
        {confidence != null && (
          <Tag color="blue" className={styles.confidenceBadge}>
            置信度 {(confidence * 100).toFixed(0)}%
          </Tag>
        )}
      </Flex>

      {/* 量表评估 */}
      {scaleItems.length > 0 && (
        <div className={styles.categorySection}>
          <div className={styles.categoryTitle}>量表评估</div>
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
      )}

      {/* 实验室筛查 */}
      {labItems.length > 0 && (
        <div className={styles.categorySection}>
          <div className={styles.categoryTitle}>实验室筛查</div>
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
      )}

      {/* 影像学检测 */}
      {imagingItems.length > 0 && (
        <div className={styles.categorySection}>
          <div className={styles.categoryTitle}>影像学检测</div>
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
      )}

      {/* AI 建议 */}
      {aiSuggestion && (
        <Alert
          type="info"
          showIcon
          message="AI 建议"
          description={aiSuggestion}
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default AICheckContent;
