import { PageContainer, ProCard } from '@ant-design/pro-components';
import { App, Button, Card, Flex, InputNumber, Slider, Typography } from 'antd';
import React, { useState } from 'react';

const { Text, Title } = Typography;

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 20;
const FONT_SIZE_DEFAULT = 14;

const SLIDER_MARKS: Record<number, string> = { [FONT_SIZE_DEFAULT]: '默认' };

const SystemSettings: React.FC = () => {
  const { modal } = App.useApp();

  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const v = parseInt(localStorage.getItem('systemFontSize') ?? '', 10);
      return v >= FONT_SIZE_MIN && v <= FONT_SIZE_MAX ? v : FONT_SIZE_DEFAULT;
    } catch {
      return FONT_SIZE_DEFAULT;
    }
  });

  const isDefault = fontSize === FONT_SIZE_DEFAULT;

  const handleSave = () => {
    try {
      localStorage.setItem('systemFontSize', String(fontSize));
    } catch {
      /* localStorage 可能不可用 */
    }
    modal.confirm({
      title: '设置已保存',
      content: '字体大小需要刷新页面后生效，是否立即刷新？',
      okText: '立即刷新',
      cancelText: '稍后',
      onOk: () => window.location.reload(),
    });
  };

  const handleReset = () => {
    setFontSize(FONT_SIZE_DEFAULT);
  };

  return (
    <PageContainer>
      <ProCard title="系统字体大小" headerBordered>
        <Flex vertical gap={24} style={{ maxWidth: 480 }}>
          <Text type="secondary">
            调整系统界面的全局字体大小，修改后需刷新页面生效
          </Text>

          <Flex align="center" gap={16}>
            <Text>小</Text>
            <Slider
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              marks={SLIDER_MARKS}
              value={fontSize}
              onChange={setFontSize}
              style={{ flex: 1 }}
              aria-label="系统字体大小"
            />
            <Text>大</Text>
            <InputNumber
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              value={fontSize}
              onChange={(v) => v != null && setFontSize(v)}
              style={{ width: 72 }}
              suffix="px"
              aria-label="系统字体大小"
            />
          </Flex>

          {/* 多层级预览 */}
          <Card title="预览效果" bordered size="small" style={{ fontSize }}>
            <Flex vertical gap={8}>
              <Title level={4} style={{ margin: 0, fontSize: fontSize + 6 }}>
                标题文本预览
              </Title>
              <Text style={{ fontSize }}>
                正文文本预览：系统将使用 {fontSize}px 作为基础字体大小
              </Text>
              <Text type="secondary" style={{ fontSize: fontSize - 2 }}>
                辅助文本预览：适用于说明、提示等次要信息
              </Text>
            </Flex>
          </Card>

          <Flex gap={12}>
            <Button type="primary" onClick={handleSave}>
              保存设置
            </Button>
            <Button onClick={handleReset} disabled={isDefault}>
              恢复默认
            </Button>
          </Flex>
        </Flex>
      </ProCard>
    </PageContainer>
  );
};

export default SystemSettings;
