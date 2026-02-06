import { ProCard } from '@ant-design/pro-components';
import { Alert, Flex, Spin, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
import type {
  OtherPossibleDisease,
  PrimaryDisease,
} from '@/services/llm/typings.d';

const { Text, Paragraph } = Typography;

const useStyles = createStyles(({ token }) => ({
  confidenceTag: {
    fontVariantNumeric: 'tabular-nums',
  },
  diseaseItem: {
    padding: '8px 0',
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}));

interface AIDiagnosisContentProps {
  loading?: boolean;
  primaryDisease: PrimaryDisease | null;
  otherDiseases: OtherPossibleDisease[];
  /** 疾病 ID -> 名称映射 */
  diseaseNameMap: Map<string, string>;
}

const AIDiagnosisContent: React.FC<AIDiagnosisContentProps> = ({
  loading,
  primaryDisease,
  otherDiseases,
  diseaseNameMap,
}) => {
  const { styles } = useStyles();

  if (loading) {
    return (
      <Spin
        tip="AI 正在诊断分析中…"
        style={{ display: 'block', padding: 60, textAlign: 'center' }}
      />
    );
  }

  if (!primaryDisease && otherDiseases.length === 0) {
    return (
      <Alert
        type="warning"
        showIcon
        message="AI 未能生成诊断建议"
        description="请根据检查结果手动选择诊断。"
        style={{ marginBottom: 16 }}
      />
    );
  }

  const resolveName = (id: string) => diseaseNameMap.get(id) ?? id;

  return (
    <Flex gap={16} style={{ marginBottom: 16 }}>
      {/* 左侧：AI 诊断结果 */}
      <ProCard
        title="AI 诊断结果"
        style={{ flex: 1, border: '1px solid #f0f0f0' }}
      >
        {primaryDisease && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>首选诊断</Text>
            <Flex align="center" gap={8} style={{ margin: '8px 0' }}>
              <Text style={{ fontSize: 16, fontWeight: 600 }}>
                {resolveName(primaryDisease.disease_id)}
              </Text>
              <Tag color="blue" className={styles.confidenceTag}>
                置信度 {(primaryDisease.confidence * 100).toFixed(0)}%
              </Tag>
            </Flex>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {primaryDisease.reason}
            </Paragraph>
          </div>
        )}

        {otherDiseases.length > 0 && (
          <div>
            <Text strong>其他可能诊断</Text>
            {otherDiseases.map((d) => (
              <div key={d.disease_id} className={styles.diseaseItem}>
                <Text>{resolveName(d.disease_id)}</Text>
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ marginBottom: 0, fontSize: 13 }}
                >
                  {d.reason}
                </Paragraph>
              </div>
            ))}
          </div>
        )}
      </ProCard>
    </Flex>
  );
};

export default AIDiagnosisContent;
