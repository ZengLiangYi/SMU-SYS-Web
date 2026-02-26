import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-components';
import { Button, Flex, Input, InputNumber, Typography, theme } from 'antd';
import React, { useState } from 'react';
import type { ScoreEntry } from './questionEditorUtils';
import { nextSeId } from './questionEditorUtils';

const { Text } = Typography;

interface ScoreMapEditorProps {
  formRef: React.RefObject<ProFormInstance | undefined>;
  initialEntries: ScoreEntry[];
  onScoreEntriesChange?: () => void;
}

const ScoreMapEditor: React.FC<ScoreMapEditorProps> = ({
  formRef,
  initialEntries,
  onScoreEntriesChange,
}) => {
  const { token } = theme.useToken();
  const [entries, setLocalEntries] = useState<ScoreEntry[]>(initialEntries);

  const setEntries = (next: ScoreEntry[]) => {
    setLocalEntries(next);
    formRef.current?.setFieldsValue({ score_entries: next });
    onScoreEntriesChange?.();
  };

  const handleAdd = () => {
    setEntries([...entries, { _id: nextSeId(), answer: '', score: 0 }]);
  };

  const handleRemove = (idx: number) => {
    setEntries(entries.filter((_, i) => i !== idx));
  };

  const handleChange = (
    idx: number,
    field: 'answer' | 'score',
    value: string | number | null,
  ) => {
    const next = entries.map((row, i) =>
      i === idx
        ? { ...row, [field]: value ?? (field === 'score' ? 0 : '') }
        : row,
    );
    setEntries(next);
  };

  return (
    <div>
      {entries.map((row, idx) => (
        <Flex
          key={row._id}
          gap={8}
          align="center"
          style={{
            marginBlockEnd: 8,
            padding: '6px 8px',
            background: token.colorFillQuaternary,
            borderRadius: token.borderRadiusSM,
          }}
        >
          <Input
            value={row.answer}
            onChange={(e) => handleChange(idx, 'answer', e.target.value)}
            placeholder="答案文本…"
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
            aria-label={`删除答案 ${idx + 1}`}
            disabled={entries.length <= 1}
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
        添加答案
      </Button>

      <ProForm.Item name="score_entries" hidden />
    </div>
  );
};

export default ScoreMapEditor;
