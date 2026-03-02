import { AutoComplete, Input } from 'antd';
import React, { useCallback, useMemo } from 'react';

/** 中英文逗号分隔符 — 提升到模块级别避免每次渲染重建 */
const SEPARATOR_RE = /[，,]/;

interface PresetTextAreaProps {
  value?: string;
  onChange?: (val: string) => void;
  presets: string[];
  placeholder?: string;
  rows?: number;
}

const PresetTextArea: React.FC<PresetTextAreaProps> = ({
  value = '',
  onChange,
  presets,
  placeholder,
  rows = 3,
}) => {
  const options = useMemo(() => {
    const parts = value.split(SEPARATOR_RE);
    const lastSegment = parts[parts.length - 1].trim();
    const alreadyUsed = new Set(parts.map((s) => s.trim()).filter(Boolean));

    return presets
      .filter(
        (p) => !alreadyUsed.has(p) && (!lastSegment || p.includes(lastSegment)),
      )
      .map((p) => ({ value: p, label: p }));
  }, [value, presets]);

  const handleSelect = useCallback(
    (selected: string) => {
      const parts = value.split(SEPARATOR_RE);
      parts[parts.length - 1] = selected;
      const newValue = parts
        .map((s) => s.trim())
        .filter(Boolean)
        .join('，');
      onChange?.(newValue);
    },
    [value, onChange],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  return (
    <AutoComplete
      options={options}
      onSelect={handleSelect}
      style={{ width: '100%' }}
      popupMatchSelectWidth={true}
    >
      <Input.TextArea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
      />
    </AutoComplete>
  );
};

export default PresetTextArea;
