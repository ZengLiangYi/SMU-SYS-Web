import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React from 'react';
import usePrescriptionStyles from './index.style';

const { Title } = Typography;

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
  const { styles, cx } = usePrescriptionStyles();

  return (
    <div className={styles.prescriptionSection}>
      <div className={styles.sectionHeader}>
        <Title level={5} className={styles.sectionTitle}>
          认知训练
        </Title>
        <span className={styles.sectionSubtitle}>每日30分钟</span>
      </div>
      <div className={styles.cognitiveCardsContainer}>
        {cards.map((item) => (
          <div key={item.id} className={styles.cognitiveCard}>
            <div className={styles.cognitiveCardContent}>
              <div className={styles.cognitiveCardName}>{item.cardName}</div>
              <div className={styles.cognitiveCardDifficulty}>
                {item.difficulty}
              </div>
            </div>
            <div className={styles.cognitiveCardActions}>
              <Button type="link" onClick={() => onEdit(item)}>
                <EditOutlined />
              </Button>
              <Button type="link" onClick={() => onDelete(item.id)}>
                <DeleteOutlined />
              </Button>
            </div>
          </div>
        ))}
        <div
          className={cx(styles.cognitiveCard, styles.addCard)}
          onClick={onAdd}
        >
          <PlusOutlined
            style={{ fontSize: 24, color: '#999', marginBottom: 8 }}
          />
          <span style={{ fontSize: 13, color: '#666' }}>更多卡片</span>
        </div>
      </div>
    </div>
  );
};

export default CognitiveTraining;
