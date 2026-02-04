import {
  EyeOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Button,
  Card,
  Input,
  message,
  Pagination,
  Space,
  Tabs,
  Tag,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import type { UserListItem } from '../../../services/patient-user/typings';
import { CROWD_CATEGORY, getCategoryColor } from '../../../utils/constants';
import useStyles from './index.style';

// 生成 valueEnum
const categoryValueEnum = Object.values(CROWD_CATEGORY).reduce(
  (acc, cat) => {
    acc[cat] = { text: cat };
    return acc;
  },
  {} as Record<string, { text: string }>,
);

const UserList: React.FC = () => {
  const { styles, cx } = useStyles();
  const actionRef = useRef<ActionType>(null);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<
    Array<{
      id: string;
      sender: 'user' | 'doctor';
      message: string;
      time: string;
    }>
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  // 聊天视图的搜索状态（单独保留）
  const [chatSearchName, setChatSearchName] = useState<string>('');
  const [chatSearchCategory, setChatSearchCategory] = useState<string>('');

  // 表格列定义
  const columns: ProColumns<UserListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 60,
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 40,
      search: false,
      valueEnum: {
        male: { text: '男' },
        female: { text: '女' },
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 40,
      search: false,
      render: (text) => `${text}岁`,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      width: 80,
      search: false,
    },
    {
      title: '紧急联系人',
      dataIndex: 'emergencyContact',
      width: 60,
      search: false,
    },
    {
      title: '诊疗评分',
      dataIndex: 'diagnosisScore',
      width: 60,
      search: false,
    },
    {
      title: '处方日评分',
      dataIndex: 'prescriptionScore',
      width: 60,
      search: false,
    },
    {
      title: '人群分类',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: categoryValueEnum,
      render: (_, record) => (
        <Tag
          color={getCategoryColor(record.category)}
          style={{ borderRadius: 12 }}
        >
          {record.category}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 40,
      search: false,
      render: (_, record) => (
        <Tag bordered color={record.status === 1 ? 'blue' : 'red'}>
          {record.status === 1 ? '已完成' : '未完成'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SwapOutlined />}
            onClick={() => handleDiagnosis(record)}
          >
            转诊
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleDiagnosis(record)}
          >
            诊断
          </Button>
          <Button
            type="link"
            size="small"
            icon={<HomeOutlined />}
            onClick={() => handleFollowUp(record)}
          >
            随访
          </Button>
        </Space>
      ),
    },
  ];

  // 操作处理函数
  const handleDetail = (record: UserListItem) => {
    history.push(`/patient-user/detail?id=${record.id}`);
  };

  const handleDiagnosis = (record: UserListItem) => {
    history.push(`/patient-user/diagnosis?id=${record.id}`);
  };

  const handleFollowUp = (record: UserListItem) => {
    message.info(`随访: ${record.name}`);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedUser) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'doctor' as const,
      message: chatMessage,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');
    message.success('消息发送成功');
  };

  // 获取模拟数据
  const getMockData = (): UserListItem[] => {
    return [
      {
        id: '1',
        name: '胡超',
        gender: 'male',
        age: 78,
        phone: '19829548475',
        emergencyContact: '胡超',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.MCI_CONTROL,
        status: 1,
      },
      {
        id: '2',
        name: '田妍',
        gender: 'female',
        age: 78,
        phone: '14084285534',
        emergencyContact: '田妍',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.SCD_WARNING,
        status: 1,
      },
      {
        id: '3',
        name: '钱强',
        gender: 'female',
        age: 78,
        phone: '19130679814',
        emergencyContact: '钱强',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 1,
      },
      {
        id: '4',
        name: '谭慧',
        gender: 'male',
        age: 78,
        phone: '16569991040',
        emergencyContact: '谭慧',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 0,
      },
      {
        id: '5',
        name: '侯霞',
        gender: 'female',
        age: 78,
        phone: '19532627819',
        emergencyContact: '侯霞',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.MCI_CONTROL,
        status: 1,
      },
      {
        id: '6',
        name: '赖玲',
        gender: 'male',
        age: 78,
        phone: '17705230984',
        emergencyContact: '赖玲',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 1,
      },
      {
        id: '7',
        name: '孟亨',
        gender: 'female',
        age: 78,
        phone: '16410083786',
        emergencyContact: '孟亨',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 1,
      },
      {
        id: '8',
        name: '王格',
        gender: 'male',
        age: 78,
        phone: '19516815745',
        emergencyContact: '王格',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.SUSPICIOUS,
        status: 1,
      },
      {
        id: '9',
        name: '曹伦',
        gender: 'male',
        age: 78,
        phone: '19966265926',
        emergencyContact: '曹伦',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 1,
      },
      {
        id: '10',
        name: '傅洁',
        gender: 'female',
        age: 78,
        phone: '19090346409',
        emergencyContact: '傅洁',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 1,
      },
      {
        id: '11',
        name: '任伟',
        gender: 'female',
        age: 78,
        phone: '17994895823',
        emergencyContact: '任伟',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 1,
      },
      {
        id: '12',
        name: '周佳',
        gender: 'female',
        age: 78,
        phone: '13092803946',
        emergencyContact: '周佳',
        diagnosisScore: 99.99,
        prescriptionScore: 99.99,
        category: CROWD_CATEGORY.NORMAL,
        status: 1,
      },
    ];
  };

  // 模拟数据请求 - 使用 ProTable 传入的 params
  const fetchUserList = async (params: Record<string, any>) => {
    const mockData = getMockData();
    let filteredData = mockData;
    if (params.name) {
      filteredData = filteredData.filter((item) =>
        item.name.includes(params.name),
      );
    }
    if (params.category) {
      filteredData = filteredData.filter(
        (item) => item.category === params.category,
      );
    }
    return { data: filteredData, success: true, total: filteredData.length };
  };

  // 获取过滤后的用户列表（聊天视图使用）
  const filteredUsers = useMemo(() => {
    return getMockData().filter((user) => {
      if (chatSearchName && !user.name.includes(chatSearchName)) return false;
      if (chatSearchCategory && user.category !== chatSearchCategory)
        return false;
      return true;
    });
  }, [chatSearchName, chatSearchCategory]);

  // 获取当前页的用户列表（聊天视图使用）
  const currentPageUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  return (
    <PageContainer>
      <Card style={{ minWidth: 800 }}>
        <Tabs
          items={[
            {
              key: 'list',
              label: '列表视图',
              children: (
                <ProTable<UserListItem>
                  headerTitle="用户列表"
                  actionRef={actionRef}
                  rowKey="id"
                  search={{
                    labelWidth: 120,
                  }}
                  request={fetchUserList}
                  columns={columns}
                  scroll={{ x: 1000 }}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'chat',
              label: '聊天视图',
              children: (
                <div className={styles.chatViewContainer}>
                  <div className={styles.chatLayout}>
                    {/* 左侧用户名列表 */}
                    <div className={styles.userNameList}>
                      <div className={styles.userNameTitle}>
                        <span>用户</span>
                      </div>
                      {currentPageUsers.map((user) => (
                        <div
                          key={user.id}
                          className={cx(
                            styles.userNameItem,
                            selectedUser?.id === user.id && 'active',
                          )}
                          onClick={() => setSelectedUser(user)}
                        >
                          <span>{user.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* 中间聊天框 */}
                    <div className={styles.chatPanel}>
                      {selectedUser ? (
                        <>
                          <div className={styles.chatHeader}>
                            <div className={styles.chatUserName}>
                              {selectedUser.name}
                            </div>
                          </div>

                          <div className={styles.chatMessages}>
                            {chatHistory.length === 0 ? (
                              <div className={styles.emptyChat}>
                                <p>暂无聊天记录</p>
                                <p style={{ fontSize: 12, color: '#999' }}>
                                  开始与用户沟通吧
                                </p>
                              </div>
                            ) : (
                              chatHistory.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={cx(styles.messageItem, msg.sender)}
                                >
                                  <div className={styles.messageContent}>
                                    <div className={styles.messageBubble}>
                                      {msg.message}
                                    </div>
                                    <div className={styles.messageTime}>
                                      {msg.time}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className={styles.chatInput}>
                            <Input.TextArea
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              placeholder="输入消息..."
                              autoSize={{ minRows: 4, maxRows: 4 }}
                              onPressEnter={(e) => {
                                if (!e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button type="primary" onClick={handleSendMessage}>
                              发送
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className={styles.emptyChatPanel}>
                          <UserOutlined
                            style={{ fontSize: 64, color: '#d9d9d9' }}
                          />
                          <p>请从左侧选择一个用户开始聊天</p>
                        </div>
                      )}
                    </div>

                    {/* 右侧用户详情 */}
                    <div className={styles.userDetailPanel}>
                      {selectedUser ? (
                        <div className={styles.detailBody}>
                          <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>基本信息</h4>
                            <div className={styles.detailGrid}>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>姓名：</div>
                                <div className={styles.detailValue}>
                                  {selectedUser.name}
                                </div>
                              </div>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>性别：</div>
                                <div className={styles.detailValue}>
                                  {selectedUser.gender === 'male' ? '男' : '女'}
                                </div>
                              </div>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>年龄：</div>
                                <div className={styles.detailValue}>
                                  {selectedUser.age}岁
                                </div>
                              </div>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  联系方式：
                                </div>
                                <div className={styles.detailValue}>
                                  {selectedUser.phone}
                                </div>
                              </div>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  紧急联系人：
                                </div>
                                <div className={styles.detailValue}>
                                  {selectedUser.emergencyContact}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>诊疗信息</h4>
                            <div className={styles.detailGrid}>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  人群分类：
                                </div>
                                <Tag
                                  color={getCategoryColor(
                                    selectedUser.category,
                                  )}
                                  style={{ borderRadius: 12 }}
                                >
                                  {selectedUser.category}
                                </Tag>
                              </div>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>状态：</div>
                                <Tag
                                  bordered
                                  color={
                                    selectedUser.status === 1 ? 'blue' : 'red'
                                  }
                                >
                                  {selectedUser.status === 1
                                    ? '已完成'
                                    : '未完成'}
                                </Tag>
                              </div>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  诊疗评分：
                                </div>
                                <div
                                  className={cx(
                                    styles.detailValue,
                                    styles.scoreHighlight,
                                  )}
                                >
                                  {selectedUser.diagnosisScore}
                                </div>
                              </div>
                              <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>
                                  处方日评分：
                                </div>
                                <div
                                  className={cx(
                                    styles.detailValue,
                                    styles.scoreHighlight,
                                  )}
                                >
                                  {selectedUser.prescriptionScore}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>操作</h4>
                            <Space>
                              <Button
                                type="link"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleDetail(selectedUser)}
                              >
                                详情
                              </Button>
                              <Button
                                type="link"
                                size="small"
                                icon={<SwapOutlined />}
                                onClick={() => handleDiagnosis(selectedUser)}
                              >
                                转诊
                              </Button>
                              <Button
                                type="link"
                                size="small"
                                icon={<PlayCircleOutlined />}
                                onClick={() => handleDiagnosis(selectedUser)}
                              >
                                诊断
                              </Button>
                              <Button
                                type="link"
                                size="small"
                                icon={<HomeOutlined />}
                                onClick={() => handleFollowUp(selectedUser)}
                              >
                                随访
                              </Button>
                            </Space>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <div className={styles.emptyContent}>
                            <UserOutlined
                              style={{ fontSize: 64, color: '#d9d9d9' }}
                            />
                            <p>请从左侧选择一个用户查看详情</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 分页器 */}
                  <div className={styles.chatPagination}>
                    <Pagination
                      size="small"
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredUsers.length}
                      onChange={(page, size) => {
                        setCurrentPage(page);
                        if (size) setPageSize(size);
                      }}
                      showSizeChanger={false}
                      showTotal={(total) =>
                        `第 ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, total)} 条/共计 ${total} 条`
                      }
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default UserList;
