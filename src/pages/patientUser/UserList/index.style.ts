import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  // 聊天视图容器
  chatViewContainer: {
    '.chat-layout': {
      display: 'flex',
      height: 540,
      padding: '0 24px',
    },
  },

  // 聊天布局
  chatLayout: {
    display: 'flex',
    height: 540,
    padding: '0 24px',
  },

  // 左侧用户名列表
  userNameList: {
    width: 140,
    flexShrink: 0,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#d8d8d8',
      borderRadius: 2,
    },
    '&::-webkit-scrollbar-track': {
      background: '#f3f3f3',
      borderRadius: 2,
    },
  },

  userNameTitle: {
    border: '1px solid #f3f3f3',
    background: '#f7f7f9',
    padding: '12px 8px',
    fontSize: 14,
    color: '#9b9b9b',
    fontWeight: 600,
  },

  userNameItem: {
    padding: '12px 8px',
    cursor: 'pointer',
    fontSize: 14,
    color: '#333',
    fontWeight: 600,
    border: '1px solid #f3f3f3',
    '&:hover': {
      background: '#f0f0f0',
    },
    '&.active': {
      background: '#f0f0f0',
    },
  },

  // 中间聊天面板
  chatPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    overflow: 'hidden',
  },

  chatHeader: {
    padding: '12px 20px',
    borderBottom: '1px solid #dedede',
    background: '#f5f5f5',
  },

  chatUserName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    marginBottom: 2,
  },

  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: 20,
    background: '#f5f5f5',
  },

  emptyChat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
    p: {
      margin: '4px 0',
    },
  },

  messageItem: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    '&.doctor': {
      flexDirection: 'row-reverse',
      '.message-content': {
        alignItems: 'flex-end',
      },
      '.message-bubble': {
        background: token.colorPrimary,
        color: '#fff',
      },
    },
  },

  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    maxWidth: '60%',
  },

  messageBubble: {
    padding: '10px 14px',
    borderRadius: 8,
    background: '#fff',
    wordBreak: 'break-word',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    fontSize: 14,
    lineHeight: 1.5,
  },

  messageTime: {
    fontSize: 11,
    color: '#999',
    padding: '0 4px',
  },

  chatInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '16px 20px',
    borderTop: '1px solid #dedede',
    background: '#f5f5f5',
    alignItems: 'flex-end',
    textarea: {
      flex: 1,
      resize: 'none',
      borderRadius: 4,
      background: '#f5f5f5',
      border: 'none',
      '&:focus, &:focus-visible, &:hover': {
        border: 'none',
        boxShadow: 'none',
        outline: 'none',
      },
    },
    button: {
      height: 30,
      padding: '0 24px',
      borderRadius: 4,
    },
  },

  emptyChatPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
    p: {
      marginTop: 16,
      fontSize: 14,
    },
  },

  // 右侧用户详情面板
  userDetailPanel: {
    width: 280,
    flexShrink: 0,
    background: '#fff',
    overflowY: 'auto',
    border: '1px solid #f3f3f3',
    '&::-webkit-scrollbar': {
      width: 6,
      height: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#d8d8d8',
      borderRadius: 2,
    },
    '&::-webkit-scrollbar-track': {
      background: '#f3f3f3',
      borderRadius: 2,
    },
  },

  detailBody: {
    padding: '12px 8px',
  },

  detailSection: {
    marginBottom: 16,
    '&:last-child': {
      marginBottom: 0,
    },
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    marginBottom: 8,
    paddingBottom: 8,
  },

  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },

  detailItem: {
    '.status-tag': {
      width: 60,
    },
  },

  detailLabel: {
    fontSize: 13,
    color: '#929292',
    fontWeight: 600,
    minWidth: 90,
    marginBottom: 6,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: 600,
  },

  scoreHighlight: {
    color: token.colorPrimary,
    fontWeight: 600,
    fontSize: 15,
  },

  emptyState: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContent: {
    textAlign: 'center',
    color: '#999',
    p: {
      marginTop: 16,
      fontSize: 14,
    },
  },

  // 分页器
  chatPagination: {
    padding: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    background: '#fff',
  },
}));

export default useStyles;
