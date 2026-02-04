import { ManOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { Avatar, Tag } from 'antd';
import React from 'react';
import { getCategoryColor } from '@/utils/constants';
import './index.less';

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
    <div className="patient-info-card">
      <div className="user-info-container">
        <div className="user-avatar-section">
          <Avatar size={80} icon={<UserOutlined />} className="user-avatar" />
        </div>
        <div className="user-info-section">
          <div className="user-name-row">
            <span className="user-name">{name}</span>
            {gender === 'male' ? (
              <ManOutlined style={{ color: '#336fff' }} />
            ) : (
              <WomanOutlined style={{ color: '#ff4d4f' }} />
            )}
            <span className="user-age">{age}岁</span>
          </div>
          <div className="user-contact">联系方式：{phone}</div>
          <div className="user-category">
            <Tag className="category-tag" color={getCategoryColor(category)}>
              {category}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAvatarInfoContent;
