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
    modal.confirm({
      title: '确认保存',
      content: `字体大小将调整为 ${fontSize}px，需要刷新页面以生效`,
      okText: '保存并刷新',
      cancelText: '取消',
      onOk: () => {
        try {
          localStorage.setItem('systemFontSize', String(fontSize));
        } catch {
          /* localStorage 可能不可用 */
        }
        window.location.reload();
      },
    });
  };

  const handleReset = () => {
    modal.confirm({
      title: '确认恢复默认',
      content: '字体大小将恢复为默认值，需要刷新页面以生效',
      okText: '恢复并刷新',
      cancelText: '取消',
      onOk: () => {
        try {
          localStorage.setItem('systemFontSize', String(FONT_SIZE_DEFAULT));
        } catch {
          /* localStorage 可能不可用 */
        }
        window.location.reload();
      },
    });
  };

  return (
    <PageContainer>
      <ProCard title="系统字体大小" headerBordered>
        <Flex vertical gap={24} style={{ maxWidth: 480 }}>
          <Text type="secondary">
            调整系统界面的全局字体大小，保存后刷新页面生效
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
