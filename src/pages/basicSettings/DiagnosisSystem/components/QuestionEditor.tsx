import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  Button,
  Empty,
  Flex,
  Input,
  InputNumber,
  Typography,
  theme,
} from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import type {
  DiagnosticScaleQuestionContent,
  DiagnosticScaleQuestionPayload,
  QuestionType,
} from '@/services/diagnostic-scale/typings.d';
import {
  OPTION_KEY_LETTERS,
  QUESTION_TYPE_OPTIONS,
  TYPES_WITH_OPTIONS,
} from '@/utils/constants';

const { Text } = Typography;

interface OptionRow {
  key: string;
  label: string;
  score: number;
}

let seId = 0;
function nextSeId(): string {
  return `se_${++seId}`;
}

interface ScoreEntry {
  _id: string;
  answer: string;
  score: number;
}

function toOptionRows(content?: DiagnosticScaleQuestionContent): OptionRow[] {
  if (!content) return [];
  return content.options.map((opt) => ({
    key: opt.key,
    label: opt.label,
    score: content.score_map[opt.key] ?? content.default_score,
  }));
}

function fromOptionRows(
  rows: OptionRow[],
  allowMultiple: boolean,
  defaultScore: number,
): DiagnosticScaleQuestionContent {
  const options = rows.map((r) => ({ key: r.key, label: r.label }));
  const scoreMap: Record<string, number> = {};
  for (const r of rows) {
    scoreMap[r.key] = r.score;
  }
  return {
    options,
    score_map: scoreMap,
    allow_multiple: allowMultiple,
    default_score: defaultScore,
  };
}

function toScoreEntries(
  content?: DiagnosticScaleQuestionContent,
): ScoreEntry[] {
  if (!content) return [];
  return Object.entries(content.score_map).map(([answer, score]) => ({
    _id: nextSeId(),
    answer,
    score,
  }));
}

function fromScoreEntries(
  entries: ScoreEntry[],
  defaultScore: number,
): DiagnosticScaleQuestionContent {
  const scoreMap: Record<string, number> = {};
  for (const e of entries) {
    scoreMap[e.answer] = e.score;
  }
  return {
    options: [],
    score_map: scoreMap,
    allow_multiple: false,
    default_score: defaultScore,
  };
}

export interface QuestionEditorRef {
  getValues: () => DiagnosticScaleQuestionPayload | null;
  setValues: (q: DiagnosticScaleQuestionPayload) => void;
  validate: () => Promise<boolean>;
}

interface QuestionEditorProps {
  question: DiagnosticScaleQuestionPayload | null;
  questionIndex: number;
  onChange?: (q: DiagnosticScaleQuestionPayload) => void;
}

const QuestionEditor = React.forwardRef<QuestionEditorRef, QuestionEditorProps>(
  ({ question, questionIndex, onChange }, ref) => {
    const { token } = theme.useToken();
    const formRef = useRef<ProFormInstance>(undefined);

    const optionRowsToForm = (q: DiagnosticScaleQuestionPayload) => ({
      question_stem: q.question_stem,
      question_type: q.question_type,
      scoring_rule: q.scoring_rule,
      allow_multiple: q.question_content.allow_multiple,
      default_score: q.question_content.default_score,
      options: toOptionRows(q.question_content),
      score_entries: toScoreEntries(q.question_content),
    });

    const formToPayload = (): DiagnosticScaleQuestionPayload | null => {
      const values = formRef.current?.getFieldsValue();
      if (!values) return null;
      const qType = values.question_type as QuestionType;
      const baseFields = {
        _uid: question?._uid,
        question_stem: values.question_stem ?? '',
        question_type: qType,
        scoring_rule: values.scoring_rule ?? '',
      };

      if (qType === 'fill_blank') {
        const entries: ScoreEntry[] = values.score_entries ?? [];
        return {
          ...baseFields,
          question_content: fromScoreEntries(
            entries,
            values.default_score ?? 0,
          ),
        };
      }

      const hasOptions = TYPES_WITH_OPTIONS.has(qType);
      const rows: OptionRow[] = hasOptions ? (values.options ?? []) : [];
      return {
        ...baseFields,
        question_content: fromOptionRows(
          rows,
          values.allow_multiple ?? false,
          values.default_score ?? 0,
        ),
      };
    };

    useImperativeHandle(ref, () => ({
      getValues: formToPayload,
      setValues: (q: DiagnosticScaleQuestionPayload) => {
        formRef.current?.setFieldsValue(optionRowsToForm(q));
      },
      validate: async () => {
        try {
          await formRef.current?.validateFields();
          return true;
        } catch {
          return false;
        }
      },
    }));

    if (!question) {
      return (
        <Flex align="center" justify="center" style={{ height: '100%' }}>
          <Empty description="请在左侧选择或添加题目" />
        </Flex>
      );
    }

    return (
      <div
        style={{
          padding: '16px 24px',
          background: token.colorBgContainer,
          borderRadius: token.borderRadius,
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Text
          strong
          style={{
            display: 'block',
            marginBlockEnd: 16,
            fontSize: 15,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          第 {questionIndex + 1} 题
        </Text>

        <ProForm
          formRef={formRef}
          submitter={false}
          initialValues={optionRowsToForm(question)}
          onValuesChange={() => {
            const payload = formToPayload();
            if (payload) onChange?.(payload);
          }}
          layout="vertical"
        >
          <ProFormText
            name="question_stem"
            label="题干"
            placeholder="请输入题干…"
            rules={[{ required: true, message: '请输入题干' }]}
          />

          <ProFormSelect
            name="question_type"
            label="题目类型"
            placeholder="请选择题目类型…"
            width="sm"
            options={QUESTION_TYPE_OPTIONS}
            rules={[{ required: true, message: '请选择题目类型' }]}
            fieldProps={{ allowClear: false }}
          />

          <ProFormDependency name={['question_type']}>
            {({ question_type }) => {
              const qType = question_type as QuestionType;
              const hasOptions = TYPES_WITH_OPTIONS.has(qType);
              const isFillBlank = qType === 'fill_blank';
              if (!hasOptions && !isFillBlank) return null;

              return (
                <>
                  {hasOptions && (
                    <ProForm.Item label="选项" required>
                      <OptionsEditor
                        formRef={formRef}
                        initialOptions={toOptionRows(
                          question?.question_content,
                        )}
                        onOptionsChange={() => {
                          const payload = formToPayload();
                          if (payload) onChange?.(payload);
                        }}
                      />
                    </ProForm.Item>
                  )}
                  {isFillBlank && (
                    <ProForm.Item label="答案评分映射" required>
                      <ScoreMapEditor
                        formRef={formRef}
                        initialEntries={toScoreEntries(
                          question?.question_content,
                        )}
                        onScoreEntriesChange={() => {
                          const payload = formToPayload();
                          if (payload) onChange?.(payload);
                        }}
                      />
                    </ProForm.Item>
                  )}
                  <Flex gap={24} align="center" style={{ marginBlockEnd: 24 }}>
                    {/* TODO: 预留扩展 —— 允许多选开关，后端支持后启用
                    <ProForm.Item
                      name="allow_multiple"
                      label="允许多选"
                      valuePropName="checked"
                      style={{ marginBottom: 0 }}
                    >
                      <Switch size="small" />
                    </ProForm.Item>
                    */}
                    <ProFormDigit
                      name="default_score"
                      label="默认分数"
                      width="xs"
                      formItemProps={{ style: { marginBottom: 0 } }}
                      fieldProps={{
                        precision: 1,
                        style: { fontVariantNumeric: 'tabular-nums' },
                      }}
                    />
                  </Flex>
                </>
              );
            }}
          </ProFormDependency>

          <ProFormTextArea
            name="scoring_rule"
            label="记分规则"
            placeholder="请输入记分规则及判定…"
            fieldProps={{ rows: 3 }}
            rules={[{ required: true, message: '请输入记分规则' }]}
          />
        </ProForm>
      </div>
    );
  },
);

QuestionEditor.displayName = 'QuestionEditor';

export default QuestionEditor;

// ---------- Options sub-editor ----------

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

// ---------- Score-map sub-editor (fill_blank) ----------

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
