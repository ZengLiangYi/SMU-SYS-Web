import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import './index.less';

interface DietPrescriptionProps {
  content: string;
  onEdit: () => void;
}

const DietPrescription: React.FC<DietPrescriptionProps> = ({
  content,
  onEdit,
}) => {
  return (
    <div className="prescription-section">
      <div className="section-header">
        <h3 className="section-title">饮食处方</h3>
        <Button type="link" className="action-btn" onClick={onEdit}>
          <EditOutlined />
        </Button>
      </div>
      <div className="diet-content">{content}</div>
    </div>
  );
};

export default DietPrescription;
