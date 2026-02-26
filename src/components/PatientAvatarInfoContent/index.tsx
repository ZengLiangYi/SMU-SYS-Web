import { ManOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { Avatar, Flex, Space, Tag, Typography, theme } from 'antd';
import React from 'react';
import { getCategoryColor } from '@/utils/constants';

const { Text } = Typography;

interface PatientAvatarInfoContentProps {
  name: string;
  gender: string;
  age: number;
  phone: string;
  categories: string[];
}

const PatientAvatarInfoContent: React.FC<PatientAvatarInfoContentProps> = ({
  name,
  gender,
  age,
  phone,
  categories,
}) => {
  const { token } = theme.useToken();

  return (
    <div>
      <Flex gap={24}>
        <Avatar size={80} icon={<UserOutlined />} style={{ flexShrink: 0 }} />
        <Flex vertical justify="center">
          <Space style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: token.fontSizeHeading4 }}>
              {name}
            </Text>
            {gender === '男' || gender === 'male' ? (
              <ManOutlined style={{ color: token.colorPrimary }} />
            ) : (
              <WomanOutlined style={{ color: token.colorError }} />
            )}
            <Text type="secondary">{age}岁</Text>
          </Space>
          <Text type="secondary" style={{ marginBottom: 8 }}>
            联系方式：{phone}
          </Text>
          <Space size={4} wrap>
            {categories.map((cat) => (
              <Tag
                key={cat}
                color={getCategoryColor(cat)}
                style={{ borderRadius: token.borderRadiusSM }}
              >
                {cat}
              </Tag>
            ))}
          </Space>
        </Flex>
      </Flex>
    </div>
  );
};

export default PatientAvatarInfoContent;
