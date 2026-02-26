import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-components';
import { Button, Flex, Input, InputNumber, Typography, theme } from 'antd';
import React, { useState } from 'react';
import { OPTION_KEY_LETTERS } from '@/utils/constants';
import type { OptionRow } from './questionEditorUtils';

const { Text } = Typography;

interface OptionsEditorProps {
  formRef: React.RefObject<ProFormInstance | undefined>;
  initialOptions: OptionRow[];
  onOptionsChange?: () => void;
}

const OptionsEditor: React.FC<OptionsEditorProps> = ({
  formRef,
  initialOptions,
  onOptionsChange,
}) => {
  const { token } = theme.useToken();
  const [options, setLocalOptions] = useState<OptionRow[]>(initialOptions);

  const setOptions = (next: OptionRow[]) => {
    setLocalOptions(next);
    formRef.current?.setFieldsValue({ options: next });
    onOptionsChange?.();
  };

  const handleAdd = () => {
    const nextKey =
      OPTION_KEY_LETTERS[options.length] ?? `O${options.length + 1}`;
    setOptions([...options, { key: nextKey, label: '', score: 0 }]);
  };

  const handleRemove = (idx: number) => {
    const next = options.filter((_, i) => i !== idx);
    const reKeyed = next.map((row, i) => ({
      ...row,
      key: OPTION_KEY_LETTERS[i] ?? `O${i + 1}`,
    }));
    setOptions(reKeyed);
  };

  const handleChange = (
    idx: number,
    field: 'label' | 'score',
    value: string | number | null,
  ) => {
    const next = options.map((row, i) =>
      i === idx
        ? { ...row, [field]: value ?? (field === 'score' ? 0 : '') }
        : row,
    );
    setOptions(next);
  };

  return (
    <div>
      {options.map((row, idx) => (
        <Flex
          key={row.key}
          gap={8}
          align="center"
          style={{
            marginBlockEnd: 8,
            padding: '6px 8px',
            background: token.colorFillQuaternary,
            borderRadius: token.borderRadiusSM,
          }}
        >
          <Text
            strong
            style={{
              width: 24,
              textAlign: 'center',
              flexShrink: 0,
              color: token.colorPrimary,
            }}
          >
            {row.key}
          </Text>
          <Input
            value={row.label}
            onChange={(e) => handleChange(idx, 'label', e.target.value)}
            placeholder="请输入选项文本…"
            size="small"
            style={{ flex: 1, minWidth: 0 }}
          />
          <Text type="secondary" style={{ flexShrink: 0, fontSize: 13 }}>
            分数
          </Text>
          <InputNumber
            value={row.score}
            onChange={(v) => handleChange(idx, 'score', v)}
            precision={1}
            size="small"
            style={{
              width: 64,
              flexShrink: 0,
              fontVariantNumeric: 'tabular-nums',
            }}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemove(idx)}
            aria-label={`删除选项 ${row.key}`}
            disabled={options.length <= 1}
          />
        </Flex>
      ))}

      <Button
        type="dashed"
        size="small"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBlockStart: 4 }}
      >
        添加选项
      </Button>

      <ProForm.Item name="options" hidden />
    </div>
  );
};

export default OptionsEditor;
