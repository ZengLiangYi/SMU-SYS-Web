import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Empty,
  Flex,
  Popconfirm,
  Tag,
  Typography,
  theme,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { DiagnosticScaleQuestionPayload } from '@/services/diagnostic-scale/typings.d';
import { QUESTION_TYPE_LABELS } from '@/utils/constants';

const { Text } = Typography;

export type CopyPosition = 'after' | 'end';

interface QuestionNavProps {
  questions: DiagnosticScaleQuestionPayload[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onCopy: (index: number, position: CopyPosition) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

const QuestionNav: React.FC<QuestionNavProps> = React.memo(
  ({ questions, activeIndex, onSelect, onCopy, onDelete, onAdd }) => {
    const { token } = theme.useToken();
    const activeRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
      activeRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }, [activeIndex]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown' && activeIndex < questions.length - 1) {
          e.preventDefault();
          onSelect(activeIndex + 1);
        } else if (e.key === 'ArrowUp' && activeIndex > 0) {
          e.preventDefault();
          onSelect(activeIndex - 1);
        }
      },
      [activeIndex, questions.length, onSelect],
    );

    return (
      <Flex
        vertical
        style={{ height: '100%', background: token.colorBgLayout }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="listbox"
        aria-label="题目导航列表"
      >
        {/* Scrollable question list */}
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'auto',
              padding: '8px 0',
            }}
          >
            {questions.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="点击下方按钮添加第一道题目"
                style={{ marginBlock: 32 }}
              />
            ) : (
              questions.map((q, index) => {
                const isActive = index === activeIndex;
                const isLast = questions.length <= 1;

                return (
                  <Flex
                    key={q._uid ?? index}
                    ref={isActive ? activeRef : undefined}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => onSelect(index)}
                    align="center"
                    gap={8}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      background: isActive
                        ? token.colorPrimaryBg
                        : hoveredIndex === index
                          ? token.colorBgTextHover
                          : 'transparent',
                      borderInlineStart: isActive
                        ? `3px solid ${token.colorPrimary}`
                        : '3px solid transparent',
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={() => {
                      if (!isActive) setHoveredIndex(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                    }}
                  >
                    {/* Number badge */}
                    <Text
                      type="secondary"
                      style={{
                        flexShrink: 0,
                        width: 20,
                        textAlign: 'center',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {index + 1}
                    </Text>

                    {/* Stem + type tag */}
                    <Flex vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        ellipsis
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {q.question_stem || '未填写题干'}
                      </Text>
                      {q.question_type && (
                        <Tag
                          style={{ alignSelf: 'flex-start', fontSize: 11 }}
                          bordered={false}
                        >
                          {QUESTION_TYPE_LABELS[q.question_type] ??
                            q.question_type}
                        </Tag>
                      )}
                    </Flex>

                    {/* Action buttons (visible on hover via CSS, always in DOM) */}
                    <Flex
                      className="question-nav-actions"
                      gap={2}
                      style={{
                        flexShrink: 0,
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.15s',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        menu={{
                          items: [
                            { key: 'after', label: '复制到下方' },
                            { key: 'end', label: '复制到末尾' },
                          ],
                          onClick: ({ key }) =>
                            onCopy(index, key as CopyPosition),
                        }}
                        trigger={['click']}
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          aria-label="复制题目"
                        />
                      </Dropdown>
                      <Popconfirm
                        title="确认删除该题目？"
                        onConfirm={() => onDelete(index)}
                        disabled={isLast}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          aria-label="删除题目"
                          disabled={isLast}
                        />
                      </Popconfirm>
                    </Flex>
                  </Flex>
                );
              })
            )}
          </div>
        </div>

        {/* Fixed bottom add button */}
        <div
          style={{
            padding: '8px 12px',
            borderBlockStart: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Button type="dashed" block icon={<PlusOutlined />} onClick={onAdd}>
            添加题目
          </Button>
        </div>
      </Flex>
    );
  },
);

QuestionNav.displayName = 'QuestionNav';

export default QuestionNav;
