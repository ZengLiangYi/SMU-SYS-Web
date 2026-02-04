import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  // 主容器
  userDetailCard: {
    minWidth: 800,
    background: '#fff',
    borderRadius: 8,
    minHeight: 'calc(100vh - 120px)',
  },

  // 页面头部
  userDetailHeader: {
    padding: '24px 24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },

  // 用户基本信息区域
  userBasicInfo: {
    margin: '0 24px',
    padding: '16px 0',
    borderTop: '1px solid #fafafa',
  },

  aiSuggestion: {
    fontSize: 15,
    color: '#999',
    marginBottom: 12,
  },

  userInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
  },

  userInfoLeft: {
    display: 'flex',
    gap: 24,
  },

  // 诊断评分展示
  userDiagnosisScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },

  scoreValue: {
    fontFamily: 'cursive',
    fontSize: 85,
    lineHeight: '60px',
    fontWeight: 'bold',
    marginBottom: 12,
  },

  scoreLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: 600,
    lineHeight: '12px',
  },

  scoreUpdateTime: {
    fontSize: 11,
    color: '#b0b0b5',
    fontWeight: 500,
    lineHeight: '11px',
  },

  // Tab 内容区域
  tabContent: {
    padding: '24px 0',
  },

  // 信息区块
  infoSection: {
    marginBottom: 32,
    '&:last-child': {
      marginBottom: 0,
    },
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },

  // 信息网格
  infoGrid: {
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px 40px',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
  },

  infoItemFullWidth: {
    gridColumn: '1 / -1',
  },

  infoLabel: {
    fontSize: 13,
    color: '#000',
    minWidth: 90,
    flexShrink: 0,
  },

  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: 500,
  },

  // 联系人表格
  contactTable: {
    border: '1px solid #f0f0f0',
    borderRadius: 4,
  },

  contactHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr',
    background: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
    fontWeight: 600,
  },

  contactRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr',
  },

  contactCol: {
    padding: '12px 16px',
    fontSize: 13,
    color: '#666',
  },

  // 状态标签
  statusBadge: {
    padding: '2px 12px',
    borderRadius: 12,
    fontSize: 11,
    '&.completed': {
      color: token.colorPrimary,
      border: `1px solid ${token.colorPrimary}`,
    },
    '&.uncompleted': {
      color: '#ff4d4f',
      border: '1px solid #ff4d4f',
    },
  },

  completeStatus: {
    gap: 4,
    display: 'flex',
    color: token.colorPrimary,
  },

  uncompleteStatus: {
    gap: 4,
    display: 'flex',
    color: '#ff4d4f',
  },

  // 疗效评估
  trendChartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
  },

  trendChartItem: {
    background: '#fff',
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  },

  aiSuggestionBox: {
    background: '#fffbe6',
    borderRadius: 8,
    padding: 20,
  },

  aiSuggestionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    marginBottom: 12,
  },

  aiSuggestionContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.8,
  },

  // 康复评分可视化
  scoreVisualizationContainer: {
    display: 'flex',
    gap: 24,
    marginBottom: 32,
  },

  scoreVisualizationLeft: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    padding: '16px 32px',
  },

  scoreSummaryDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: 12,
    borderBottom: '1px solid #f0f0f0',
  },

  scoreSummaryLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
  },

  scoreSummaryValue: {
    fontFamily: 'cursive',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: '70px',
  },

  scoreCharts: {
    display: 'flex',
    flexDirection: 'column',
    gap: 42,
    flex: 1,
    position: 'relative',
    paddingBottom: 25,
  },

  scoreChartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },

  chartLabel: {
    fontSize: 11,
    color: '#a5a5a5',
    minWidth: 40,
    textAlign: 'right',
  },

  chartBarContainer: {
    flex: 1,
    height: 16,
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },

  chartBar: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
    position: 'relative',
    zIndex: 1,
  },

  chartScales: {
    position: 'absolute',
    bottom: 0,
    left: 56,
    right: 0,
    height: 20,
    display: 'flex',
    alignItems: 'center',
  },

  chartScale: {
    position: 'absolute',
    fontSize: 11,
    color: '#999',
    transform: 'translateX(-50%)',
  },

  scoreVisualizationRight: {
    width: '100%',
  },

  scoreRecommendationBox: {
    background: '#fffbe6',
    borderRadius: 8,
    padding: 20,
    height: '100%',
  },

  scoreRecommendationTitle: {
    fontSize: 13,
    color: '#333',
    fontWeight: 600,
    marginBottom: 12,
  },

  scoreRecommendationContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.8,
  },

  // 康复处方列表
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

  cognitiveCardName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },

  cognitiveCardDifficulty: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  cognitiveCardAdd: {
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
  dietPrescriptionBox: {
    background: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 13,
    color: '#666',
    lineHeight: 1.8,
  },

  // 运动处方
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

  exerciseName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    flex: 1,
  },

  exerciseDuration: {
    fontSize: 13,
    color: '#666',
    margin: '0 16px',
  },
}));

export default useStyles;
