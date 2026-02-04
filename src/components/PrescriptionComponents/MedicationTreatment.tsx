import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import './index.less';

interface MedicationItem {
  id: string;
  medicineName: string;
  usage: string;
  dosage: string;
}

interface MedicationTreatmentProps {
  medications: MedicationItem[];
  onAdd: () => void;
  onEdit: (item: MedicationItem) => void;
  onDelete: (id: string) => void;
}

const MedicationTreatment: React.FC<MedicationTreatmentProps> = ({
  medications,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="prescription-section">
      <div className="section-header">
        <h3 className="section-title">药物治疗</h3>
        <Button type="link" className="add-button" onClick={onAdd}>
          +添加药物
        </Button>
      </div>
      <div className="prescription-list">
        {medications.map((item) => (
          <div key={item.id} className="prescription-item">
            <div className="prescription-content">
              <div className="prescription-name">{item.medicineName}</div>
              <div className="prescription-detail">用法：{item.usage}</div>
            </div>
            <div className="prescription-dosage">{item.dosage}</div>
            <div className="prescription-actions">
              <Button
                type="link"
                className="action-btn"
                onClick={() => onEdit(item)}
              >
                <EditOutlined />
              </Button>
              <Button
                type="link"
                className="action-btn"
                onClick={() => onDelete(item.id)}
              >
                <DeleteOutlined />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationTreatment;
