import { createStyles } from 'antd-style';

const usePrescriptionStyles = createStyles(({ token }) => ({
  // 处方区块
  prescriptionSection: {
    marginBottom: 24,
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#000',
    margin: 0,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#999',
  },

  // 药物治疗列表
  prescriptionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  prescriptionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    background: '#f5f5f5',
    borderRadius: 8,
  },

  prescriptionContent: {
    flex: 1,
  },

  prescriptionName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    marginBottom: 8,
  },

  prescriptionDetail: {
    fontSize: 12,
    color: '#666',
  },

  prescriptionDosage: {
    fontSize: 13,
    color: '#333',
    margin: '0 16px',
  },

  prescriptionActions: {
    display: 'flex',
    gap: 8,
  },

  // 认知训练卡片
  cognitiveCardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },

  cognitiveCard: {
    background: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  cognitiveCardContent: {
    textAlign: 'center',
  },

  cognitiveCardName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    marginBottom: 4,
  },

  cognitiveCardDifficulty: {
    fontSize: 12,
    color: '#666',
  },

  cognitiveCardActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
  },

  addCard: {
    background: '#fafafa',
    border: '2px dashed #d9d9d9',
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    minHeight: 100,
    '&:hover': {
      borderColor: token.colorPrimary,
      background: '#f0f5ff',
    },
  },

  // 饮食处方
  dietContent: {
    padding: 16,
    background: '#f5f5f5',
    borderRadius: 8,
    fontSize: 13,
    color: '#333',
    lineHeight: 1.8,
  },

  // 运动处方列表
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  exerciseItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    background: '#f5f5f5',
    borderRadius: 8,
  },

  exerciseContent: {
    flex: 1,
  },

  exerciseName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
  },

  exerciseDuration: {
    fontSize: 13,
    color: '#333',
    margin: '0 16px',
  },

  exerciseActions: {
    display: 'flex',
    gap: 8,
  },
}));

export default usePrescriptionStyles;
