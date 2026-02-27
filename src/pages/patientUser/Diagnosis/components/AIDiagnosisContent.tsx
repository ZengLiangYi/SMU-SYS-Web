import { Alert, Card, Divider, Flex, Spin, Tag, Typography } from 'antd';
import React from 'react';
import type {
  OtherPossibleDisease,
  PrimaryDisease,
} from '@/services/llm/typings.d';

const { Text, Paragraph } = Typography;

interface AIDiagnosisContentProps {
  loading?: boolean;
  primaryDisease: PrimaryDisease | null;
  otherDiseases: OtherPossibleDisease[];
  preventionAdvice: string;
  /** 疾病 ID -> 名称映射 */
  diseaseNameMap: Map<string, string>;
}

const AIDiagnosisContent: React.FC<AIDiagnosisContentProps> = ({
  loading,
  primaryDisease,
  otherDiseases,
  preventionAdvice,
  diseaseNameMap,
}) => {
  if (loading) {
    return (
      <Spin
        description="AI 正在诊断分析中，大约需要 1-2 分钟…"
        style={{ display: 'block', padding: 60, textAlign: 'center' }}
      />
    );
  }

  if (!primaryDisease && otherDiseases.length === 0) {
    return (
      <Alert
        type="warning"
        showIcon
        title="AI 未能生成诊断建议"
        description="请根据检查结果手动选择诊断。"
        style={{ marginBottom: 16 }}
      />
    );
  }

  const resolveName = (id: string) => diseaseNameMap.get(id) ?? id;

  return (
    <Flex gap={16} wrap style={{ marginBottom: 16 }}>
      {/* 左侧：AI 诊断结果 */}
      <Card title="AI 诊断结果" style={{ flex: 1, minWidth: 300 }}>
        {primaryDisease ? (
          <div style={{ marginBottom: 16 }}>
            <Text strong>首选诊断</Text>
            <Flex align="center" gap={8} style={{ margin: '8px 0' }}>
              <Text style={{ fontSize: 16, fontWeight: 600 }}>
                {resolveName(primaryDisease.id)}
              </Text>
              <Tag color="blue" style={{ fontVariantNumeric: 'tabular-nums' }}>
                置信度 {(primaryDisease.confidence * 100).toFixed(0)}%
              </Tag>
            </Flex>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {primaryDisease.reason}
            </Paragraph>
          </div>
        ) : null}

        {otherDiseases.length > 0 ? (
          <div>
            <Text strong>其他可能诊断</Text>
            {otherDiseases.map((d, idx) => (
              <React.Fragment key={d.id}>
                <div style={{ padding: '8px 0' }}>
                  <Text>{resolveName(d.id)}</Text>
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2 }}
                    style={{ marginBottom: 0, fontSize: 13 }}
                  >
                    {d.reason}
                  </Paragraph>
                </div>
                {idx < otherDiseases.length - 1 ? (
                  <Divider style={{ margin: 0 }} />
                ) : null}
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </Card>

      {/* 预防建议 */}
      {preventionAdvice ? (
        <Card title="预防建议" style={{ flex: 1, minWidth: 300 }}>
          <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {preventionAdvice}
          </Paragraph>
        </Card>
      ) : null}
    </Flex>
  );
};

export default AIDiagnosisContent;
