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
  category: string;
  showAlert?: boolean;
  alertText?: string;
}

const PatientAvatarInfoContent: React.FC<PatientAvatarInfoContentProps> = ({
  name,
  gender,
  age,
  phone,
  category,
}) => {
  return (
    <div>
      <Flex gap={24}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{ background: '#f0f0f0' }}
        />
        <Flex vertical justify="center">
          <Space style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 18 }}>
              {name}
            </Text>
            {gender === 'male' ? (
              <ManOutlined style={{ color: '#336fff' }} />
            ) : (
              <WomanOutlined style={{ color: '#ff4d4f' }} />
            )}
            <Text type="secondary">{age}岁</Text>
          </Space>
          <Text type="secondary" style={{ marginBottom: 8 }}>
            联系方式：{phone}
          </Text>
          <div>
            <Tag color={getCategoryColor(category)} style={{ borderRadius: 4 }}>
              {category}
            </Tag>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default PatientAvatarInfoContent;
