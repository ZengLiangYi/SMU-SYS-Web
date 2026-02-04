import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import './index.less';

interface CognitiveCard {
  id: string;
  cardName: string;
  difficulty: string;
}

interface CognitiveTrainingProps {
  cards: CognitiveCard[];
  onAdd: () => void;
  onEdit: (item: CognitiveCard) => void;
  onDelete: (id: string) => void;
}

const CognitiveTraining: React.FC<CognitiveTrainingProps> = ({
  cards,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="prescription-section">
      <div className="section-header">
        <h3 className="section-title">认知训练</h3>
        <span className="section-subtitle">每日30分钟</span>
      </div>
      <div className="cognitive-cards-container">
        {cards.map((item) => (
          <div key={item.id} className="cognitive-card">
            <div className="cognitive-card-content">
              <div className="cognitive-card-name">{item.cardName}</div>
              <div className="cognitive-card-difficulty">{item.difficulty}</div>
            </div>
            <div className="cognitive-card-actions">
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
        <div className="cognitive-card add-card" onClick={onAdd}>
          <PlusOutlined className="add-icon" />
          <span>更多卡片</span>
        </div>
      </div>
    </div>
  );
};

export default CognitiveTraining;
