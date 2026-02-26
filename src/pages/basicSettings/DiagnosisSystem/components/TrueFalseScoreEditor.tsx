import type { ProFormInstance } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-components';
import { Flex, InputNumber, Typography, theme } from 'antd';
import React, { useRef } from 'react';
import type { OptionRow } from './questionEditorUtils';

const { Text } = Typography;

const TRUE_FALSE_DISPLAY: { key: 'True' | 'False'; label: string }[] = [
  { key: 'True', label: '是' },
  { key: 'False', label: '否' },
];

interface TrueFalseScoreEditorProps {
  formRef: React.RefObject<ProFormInstance | undefined>;
  initialOptions: OptionRow[];
  onOptionsChange?: () => void;
}

const TrueFalseScoreEditor: React.FC<TrueFalseScoreEditorProps> = ({
  formRef,
  initialOptions,
  onOptionsChange,
}) => {
  const { token } = theme.useToken();
  const scoreMap = useRef<Record<string, number>>(
    initialOptions.reduce<Record<string, number>>(
      (m, o) => {
        if (o.key === 'True' || o.key === 'False') m[o.key] = o.score;
        return m;
      },
      { True: 0, False: 0 },
    ),
  );

  const sync = (key: 'True' | 'False', value: number) => {
    scoreMap.current[key] = value;
    const next: OptionRow[] = TRUE_FALSE_DISPLAY.map((d) => ({
      key: d.key,
      label: d.label,
      score: scoreMap.current[d.key] ?? 0,
    }));
    formRef.current?.setFieldsValue({ options: next });
    onOptionsChange?.();
  };

  return (
    <Flex gap={12}>
      {TRUE_FALSE_DISPLAY.map((d) => (
        <Flex
          key={d.key}
          align="center"
          gap={10}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: token.colorFillQuaternary,
            borderRadius: token.borderRadiusSM,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Text
            strong
            style={{
              fontSize: 14,
              color: d.key === 'True' ? token.colorSuccess : token.colorError,
            }}
          >
            {d.label}
          </Text>
          <div
            style={{
              flex: 1,
              borderBottom: `1px dashed ${token.colorBorderSecondary}`,
            }}
          />
          <Text type="secondary" style={{ fontSize: 13, flexShrink: 0 }}>
            分数
          </Text>
          <InputNumber
            defaultValue={
              initialOptions.find((o) => o.key === d.key)?.score ?? 0
            }
            onChange={(v) => sync(d.key, v ?? 0)}
            precision={1}
            size="small"
            style={{
              width: 64,
              flexShrink: 0,
              fontVariantNumeric: 'tabular-nums',
            }}
          />
        </Flex>
      ))}
      <ProForm.Item name="options" hidden />
    </Flex>
  );
};

export default TrueFalseScoreEditor;
