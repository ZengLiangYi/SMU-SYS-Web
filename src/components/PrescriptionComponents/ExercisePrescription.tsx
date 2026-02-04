import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import './index.less';

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
  return (
    <div className="prescription-section">
      <div className="section-header">
        <h3 className="section-title">运动处方</h3>
        <Button type="link" className="add-button" onClick={onAdd}>
          +添加计划
        </Button>
      </div>
      <div className="exercise-list">
        {exercises.map((item) => (
          <div key={item.id} className="exercise-item">
            <div className="exercise-content">
              <div className="exercise-name">{item.exerciseName}</div>
            </div>
            <div className="exercise-duration">{item.duration}</div>
            <div className="exercise-actions">
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

export default ExercisePrescription;
