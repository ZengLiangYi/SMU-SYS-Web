import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Empty, Flex, Typography, theme } from 'antd';
import React, { useImperativeHandle, useRef } from 'react';
import type {
  DiagnosticScaleQuestionPayload,
  QuestionType,
} from '@/services/diagnostic-scale/typings.d';
import {
  QUESTION_TYPE_OPTIONS,
  SINGLE_CHOICE_DEFAULT_OPTIONS,
  TRUE_FALSE_DEFAULT_OPTIONS,
  TYPES_WITH_OPTIONS,
} from '@/utils/constants';
import OptionsEditor from './OptionsEditor';
import type { OptionRow, ScoreEntry } from './questionEditorUtils';
import {
  fromOptionRows,
  fromScoreEntries,
  toOptionRows,
  toScoreEntries,
} from './questionEditorUtils';
import ScoreMapEditor from './ScoreMapEditor';
import TrueFalseScoreEditor from './TrueFalseScoreEditor';

const { Text } = Typography;

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

      if (qType === 'short_answer') {
        return {
          ...baseFields,
          question_content: {
            options: [],
            score_map: {},
            allow_multiple: false,
            default_score: values.default_score ?? 0,
          },
        };
      }

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
          onValuesChange={(changedValues) => {
            if (changedValues.question_type) {
              const newType = changedValues.question_type as QuestionType;
              if (TYPES_WITH_OPTIONS.has(newType)) {
                const defaults =
                  newType === 'true_false'
                    ? TRUE_FALSE_DEFAULT_OPTIONS
                    : SINGLE_CHOICE_DEFAULT_OPTIONS;
                formRef.current?.setFieldsValue({
                  options: defaults,
                  score_entries: [],
                });
              } else if (newType === 'fill_blank') {
                formRef.current?.setFieldsValue({
                  options: [],
                  score_entries: [],
                });
              }
            }
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

              const formOptions = formRef.current?.getFieldValue('options') as
                | OptionRow[]
                | undefined;
              const propOptions = toOptionRows(question?.question_content);
              const initialOpts =
                formOptions && formOptions.length > 0
                  ? formOptions
                  : propOptions.length > 0
                    ? propOptions
                    : qType === 'true_false'
                      ? TRUE_FALSE_DEFAULT_OPTIONS
                      : SINGLE_CHOICE_DEFAULT_OPTIONS;

              const formEntries = formRef.current?.getFieldValue(
                'score_entries',
              ) as ScoreEntry[] | undefined;
              const propEntries = toScoreEntries(question?.question_content);
              const initialSE =
                formEntries && formEntries.length > 0
                  ? formEntries
                  : propEntries.length > 0
                    ? propEntries
                    : [];

              const isTrueFalse = qType === 'true_false';

              return (
                <>
                  {isTrueFalse && (
                    <ProForm.Item label="判断计分" required>
                      <TrueFalseScoreEditor
                        key={qType}
                        formRef={formRef}
                        initialOptions={initialOpts}
                        onOptionsChange={() => {
                          const payload = formToPayload();
                          if (payload) onChange?.(payload);
                        }}
                      />
                    </ProForm.Item>
                  )}
                  {hasOptions && !isTrueFalse && (
                    <ProForm.Item label="选项" required>
                      <OptionsEditor
                        key={qType}
                        formRef={formRef}
                        initialOptions={initialOpts}
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
                        key={qType}
                        formRef={formRef}
                        initialEntries={initialSE}
                        onScoreEntriesChange={() => {
                          const payload = formToPayload();
                          if (payload) onChange?.(payload);
                        }}
                      />
                    </ProForm.Item>
                  )}
                  <Flex gap={24} align="center" style={{ marginBlockEnd: 24 }}>
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
