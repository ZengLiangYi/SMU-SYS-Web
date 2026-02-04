import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React from 'react';
import usePrescriptionStyles from './index.style';

const { Title } = Typography;

interface ExerciseItem {
  id: string;
  exerciseName: string;
  duration: string;
}

interface ExercisePrescriptionProps {
  exercises: ExerciseItem[];
  onAdd: () => void;
  onEdit: (item: ExerciseItem) => void;
  onDelete: (id: string) => void;
}

const ExercisePrescription: React.FC<ExercisePrescriptionProps> = ({
  exercises,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const { styles } = usePrescriptionStyles();

  return (
    <div className={styles.prescriptionSection}>
      <div className={styles.sectionHeader}>
        <Title level={5} className={styles.sectionTitle}>
          运动处方
        </Title>
        <Button type="link" onClick={onAdd}>
          +添加计划
        </Button>
      </div>
      <div className={styles.exerciseList}>
        {exercises.map((item) => (
          <div key={item.id} className={styles.exerciseItem}>
            <div className={styles.exerciseContent}>
              <div className={styles.exerciseName}>{item.exerciseName}</div>
            </div>
            <div className={styles.exerciseDuration}>{item.duration}</div>
            <div className={styles.exerciseActions}>
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

export default ExercisePrescription;
