import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React from 'react';
import usePrescriptionStyles from './index.style';

const { Title } = Typography;

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
  const { styles } = usePrescriptionStyles();

  return (
    <div className={styles.prescriptionSection}>
      <div className={styles.sectionHeader}>
        <Title level={5} className={styles.sectionTitle}>
          药物治疗
        </Title>
        <Button type="link" onClick={onAdd}>
          +添加药物
        </Button>
      </div>
      <div className={styles.prescriptionList}>
        {medications.map((item) => (
          <div key={item.id} className={styles.prescriptionItem}>
            <div className={styles.prescriptionContent}>
              <div className={styles.prescriptionName}>{item.medicineName}</div>
              <div className={styles.prescriptionDetail}>
                用法：{item.usage}
              </div>
            </div>
            <div className={styles.prescriptionDosage}>{item.dosage}</div>
            <div className={styles.prescriptionActions}>
              <Button type="link" onClick={() => onEdit(item)}>
                <EditOutlined />
              </Button>
              <Button type="link" onClick={() => onDelete(item.id)}>
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
