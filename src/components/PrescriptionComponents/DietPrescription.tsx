import { EditOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React from 'react';
import usePrescriptionStyles from './index.style';

const { Title } = Typography;

interface DietPrescriptionProps {
  content: string;
  onEdit: () => void;
}

const DietPrescription: React.FC<DietPrescriptionProps> = ({
  content,
  onEdit,
}) => {
  const { styles } = usePrescriptionStyles();

  return (
    <div className={styles.prescriptionSection}>
      <div className={styles.sectionHeader}>
        <Title level={5} className={styles.sectionTitle}>
          饮食处方
        </Title>
        <Button type="link" onClick={onEdit}>
          <EditOutlined />
        </Button>
      </div>
      <div className={styles.dietContent}>{content}</div>
    </div>
  );
};

export default DietPrescription;
