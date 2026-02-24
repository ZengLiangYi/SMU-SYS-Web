import { ManOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { Avatar, Flex, Space, Tag, Typography } from 'antd';
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
  return (
    <div>
      <Flex gap={24}>
        <Avatar size={80} icon={<UserOutlined />} style={{ flexShrink: 0 }} />
        <Flex vertical justify="center">
          <Space style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 18 }}>
              {name}
            </Text>
            {gender === '男' || gender === 'male' ? (
              <ManOutlined style={{ color: '#336fff' }} />
            ) : (
              <WomanOutlined style={{ color: '#ff4d4f' }} />
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
                style={{ borderRadius: 4 }}
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
