import { createStyles } from 'antd-style';

const useDiagnosisStyles = createStyles(({ token }) => ({
  diagnosisContainer: {
    background: '#fff',
    minWidth: 860,
    maxWidth: 1200,
    margin: '0 auto',
    padding: 24,
  },

  diagnosisHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  diagnosisTitle: {
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    color: '#000',
  },

  headerActions: {
    display: 'flex',
    gap: 12,
  },

  patientInfoWrapper: {
    display: 'flex',
    gap: 24,
    marginBottom: 24,
  },

  patientInfoLeft: {
    flexShrink: 0,
    width: 280,
  },

  patientInfoRight: {
    flex: 1,
    display: 'flex',
  },

  patientArchiveSection: {
    display: 'flex',
    background: '#fff',
    borderRadius: 8,
  },

  archiveHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  archiveActions: {
    display: 'flex',
    gap: 8,
  },

  archiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },

  archiveItem: {
    display: 'flex',
    gap: 8,
  },

  archiveLabel: {
    fontSize: 13,
    color: '#000',
    minWidth: 80,
    flexShrink: 0,
  },

  archiveValue: {
    minWidth: 120,
    fontSize: 13,
    color: '#333',
    fontWeight: 500,
    wordBreak: 'break-all',
  },

  // 表单区块
  formSection: {
    marginBottom: 24,
  },

  formLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000',
    marginBottom: 8,
  },

  formTextarea: {
    width: '100%',
    borderRadius: 4,
    border: '1px solid #d9d9d9',
    padding: '8px 12px',
    fontSize: 12,
    lineHeight: 1.6,
    resize: 'vertical',
    color: '#484849',
    fontWeight: 600,
    '&:hover': {
      borderColor: '#40a9ff',
    },
    '&:focus': {
      borderColor: '#40a9ff',
      boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)',
      outline: 'none',
    },
  },

  formTip: {
    border: '2px solid #6794ff',
    color: '#6794ff',
    borderRadius: 22,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.2,
  },

  // AI检查项目推荐
  checkItemsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  confidenceBadge: {
    color: token.colorPrimary,
    border: '1px solid #6794ff',
    borderRadius: 22,
    padding: '2px 12px',
    fontSize: 12,
    fontWeight: 600,
  },

  checkItemsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    marginBottom: 24,
  },

  checkCategory: {},

  categoryTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000',
    marginBottom: 12,
  },

  checkItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },

  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    'input[type="checkbox"]': {
      cursor: 'pointer',
      width: 13,
      height: 13,
    },
  },

  itemName: {
    fontSize: 12,
    color: '#000',
    fontWeight: 600,
    flex: 1,
  },

  aiSuggestionBox: {
    background: '#fffbe6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },

  aiLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    marginBottom: 8,
  },

  aiContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.6,
  },

  checkTip: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
  },

  // 检测结果录入
  resultSection: {
    marginBottom: 24,
  },

  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000',
    marginBottom: 16,
  },

  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },

  resultLabel: {
    fontSize: 13,
    color: '#000',
    fontWeight: 600,
    minWidth: 180,
    flexShrink: 0,
  },

  resultInput: {
    flex: 1,
    fontSize: 13,
  },

  // AI认知障碍分类诊断
  aiDiagnosisHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  generateTime: {
    color: token.colorPrimary,
    border: '1px solid #6794ff',
    borderRadius: 22,
    padding: '2px 12px',
    fontSize: 12,
    fontWeight: 600,
  },

  aiDiagnosisContainer: {
    display: 'flex',
    gap: 24,
  },

  aiDiagnosisLeft: {
    flex: 1,
  },

  primaryDiagnosis: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },

  diagnosisLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },

  diagnosisResult: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  diagnosisName: {
    fontSize: 32,
    fontWeight: 600,
    color: '#000',
    lineHeight: 1.2,
  },

  confidenceTag: {
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 22,
    padding: '2px 12px',
    background: '#fff',
    border: '1px solid #52c41a',
    color: '#52c41a',
  },

  diagnosisDescription: {
    fontSize: 13,
    color: '#333',
    lineHeight: 1.8,
  },

  otherDiagnosis: {},

  otherDiagnosisLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#000',
    marginBottom: 12,
    padding: '0 4px',
    borderLeft: `3px solid ${token.colorPrimary}`,
  },

  diagnosisItem: {
    background: '#fafafa',
    borderRadius: 6,
    padding: '12px 16px',
    marginBottom: 12,
  },

  diagnosisNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000',
  },

  probability: {
    fontSize: 13,
    color: '#666',
  },

  aiDiagnosisRight: {
    flex: 1,
    borderRadius: 8,
    padding: 0,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#000',
    marginBottom: 20,
  },

  confirmSection: {
    marginBottom: 24,
  },

  confirmLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#000',
    marginBottom: 12,
  },

  remarksTextarea: {
    fontSize: 13,
    resize: 'vertical',
    borderRadius: 6,
    padding: 12,
  },

  confirmBtn: {
    height: 32,
    fontSize: 13,
    borderRadius: 6,
  },
}));

export default useDiagnosisStyles;
