import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  Input,
  message,
  Pagination,
  Select,
  Space,
  Tabs,
  Tag,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import type { UserListItem } from '../../../services/patient-user/typings';
import './index.less';
import {
  EyeOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  CROWD_CATEGORY,
  getCategoryColor,
  getStatusColor,
} from '../../../utils/constants';

const { Option } = Select;

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [filteredName, setFilteredName] = useState<string>('');
  const [filteredCategory, setFilteredCategory] = useState<string>('');
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

  // 表格列定义
  const columns: ProColumns<UserListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 60,
      fixed: 'left',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 40,
      valueEnum: {
        male: { text: '男' },
        female: { text: '女' },
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 40,
      render: (text) => `${text}岁`,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      width: 80,
    },
    {
      title: '紧急联系人',
      dataIndex: 'emergencyContact',
      width: 60,
    },
    {
      title: '诊疗评分',
      dataIndex: 'diagnosisScore',
      width: 60,
    },
    {
      title: '处方日评分',
      dataIndex: 'prescriptionScore',
      width: 60,
    },
    {
      title: '人群分类',
      dataIndex: 'category',
      width: 100,
      render: (_, record) => (
        <Tag className="category-tag" color={getCategoryColor(record.category)}>
          {record.category}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 40,
      render: (_, record) => (
        <span
          className="status-tag"
          style={{
            border: `1px solid ${getStatusColor(record.status)}`,
            color: getStatusColor(record.status),
          }}
        >
          {record.status === 1 ? '已完成' : '未完成'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space className="action-items">
          <div className="action-item" onClick={() => handleDetail(record)}>
            <EyeOutlined />
            <span>详情</span>
          </div>
          <div className="action-item" onClick={() => handleDiagnosis(record)}>
            <SwapOutlined />
            <span>转诊</span>
          </div>
          <div className="action-item" onClick={() => handleDiagnosis(record)}>
            <PlayCircleOutlined />
            <span>诊断</span>
          </div>
          <div className="action-item" onClick={() => handleFollowUp(record)}>
            <HomeOutlined />
            <span>随访</span>
          </div>
        </Space>
      ),
    },
  ];

  // 操作处理函数
  const handleDetail = (record: UserListItem) => {
    history.push(`/patient-user/detail?id=${record.id}`);
  };

  const handleTransfer = (record: UserListItem) => {
    message.info(`转诊: ${record.name}`);
    // TODO: 打开转诊弹窗
  };

  const handleDiagnosis = (record: UserListItem) => {
    history.push(`/patient-user/diagnosis?id=${record.id}`);
  };

  const handleFollowUp = (record: UserListItem) => {
    message.info(`随访: ${record.name}`);
    // TODO: 跳转到随访页面
  };

  const handleQuery = () => {
    setFilteredName(searchName);
    setFilteredCategory(searchCategory);
    setCurrentPage(1); // 查询时重置到第一页
    actionRef.current?.reload();
  };

  const handleReset = () => {
    setSearchName('');
    setSearchCategory('');
    setFilteredName('');
    setFilteredCategory('');
    setCurrentPage(1); // 重置时回到第一页
    actionRef.current?.reload();
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

  // 模拟数据请求
  const fetchUserList = async (params: any) => {
    const mockData = getMockData();

    // 应用搜索过滤
    let filteredData = mockData;
    if (filteredName) {
      filteredData = filteredData.filter((item) =>
        item.name.includes(filteredName),
      );
    }
    if (filteredCategory) {
      filteredData = filteredData.filter(
        (item) => item.category === filteredCategory,
      );
    }

    return {
      data: filteredData,
      success: true,
      total: filteredData.length,
    };
  };

  // 获取过滤后的用户列表
  const filteredUsers = useMemo(() => {
    return getMockData().filter((user) => {
      if (filteredName && !user.name.includes(filteredName)) return false;
      if (filteredCategory && user.category !== filteredCategory) return false;
      return true;
    });
  }, [filteredName, filteredCategory]);

  // 获取当前页的用户列表
  const currentPageUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  return (
    <PageContainer className="user-list-page">
      <div className="user-list-card">
        <Tabs
          items={[
            {
              key: 'list',
              label: '列表视图',
              children: (
                <>
                  <div className="toolbar">
                    <div className="toolbar-left">
                      <div className="toolbar-item">
                        <span className="toolbar-label">姓名：</span>
                        <Input
                          key="search"
                          placeholder="请输入姓名或紧急联系人姓名"
                          allowClear
                          style={{ width: 240 }}
                          value={searchName}
                          onChange={(e) => {
                            setSearchName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="toolbar-item">
                        <span className="toolbar-label">人群分类：</span>
                        <Select
                          key="category"
                          style={{ width: 200 }}
                          placeholder="全部"
                          allowClear
                          value={searchCategory || undefined}
                          onChange={(value) => {
                            setSearchCategory(value || '');
                          }}
                        >
                          <Option key="all" value="">
                            全部
                          </Option>
                          {Object.values(CROWD_CATEGORY).map((category) => (
                            <Option key={category} value={category}>
                              {category}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="toolbar-right">
                      <Button
                        className="query-button"
                        variant="solid"
                        onClick={handleQuery}
                      >
                        <SearchOutlined />
                        查询
                      </Button>
                      <Button
                        className="reset-button"
                        variant="outlined"
                        onClick={handleReset}
                      >
                        <ReloadOutlined />
                        重置
                      </Button>
                    </div>
                  </div>
                  <ProTable<UserListItem>
                    actionRef={actionRef}
                    rowKey="id"
                    search={false}
                    options={{
                      reload: false,
                      density: false,
                      fullScreen: false,
                      setting: false,
                    }}
                    request={fetchUserList}
                    columns={columns}
                    scroll={{ x: 1000 }}
                    pagination={{
                      pageSize: 10,
                    }}
                  />
                </>
              ),
            },
            {
              key: 'chat',
              label: '聊天视图',
              children: (
                <div className="chat-view-container">
                  <div className="toolbar">
                    <div className="toolbar-left">
                      <div className="toolbar-item">
                        <span className="toolbar-label">姓名：</span>
                        <Input
                          placeholder="请输入姓名或紧急联系人姓名"
                          allowClear
                          style={{ width: 240 }}
                          value={searchName}
                          onChange={(e) => {
                            setSearchName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="toolbar-item">
                        <span className="toolbar-label">人群分类：</span>
                        <Select
                          style={{ width: 200 }}
                          placeholder="全部"
                          allowClear
                          value={searchCategory || undefined}
                          onChange={(value) => {
                            setSearchCategory(value || '');
                          }}
                        >
                          <Option value="">全部</Option>
                          {Object.values(CROWD_CATEGORY).map((category) => (
                            <Option key={category} value={category}>
                              {category}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="toolbar-right">
                      <Button
                        className="query-button"
                        variant="solid"
                        onClick={handleQuery}
                      >
                        <SearchOutlined />
                        查询
                      </Button>
                      <Button
                        className="reset-button"
                        variant="outlined"
                        onClick={handleReset}
                      >
                        <ReloadOutlined />
                        重置
                      </Button>
                    </div>
                  </div>

                  <div className="chat-layout">
                    {/* 最左侧用户名列表 */}
                    <div className="user-name-list">
                      <div className="user-name-title">
                        <span className="name">用户</span>
                      </div>
                      {currentPageUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`user-name-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <span className="name">{user.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* 中间聊天框 */}
                    <div className="chat-panel">
                      {selectedUser ? (
                        <>
                          <div className="chat-header">
                            <div className="chat-user-name">
                              {selectedUser.name}
                            </div>
                          </div>

                          <div className="chat-messages">
                            {chatHistory.length === 0 ? (
                              <div className="empty-chat">
                                <p>暂无聊天记录</p>
                                <p style={{ fontSize: 12, color: '#999' }}>
                                  开始与用户沟通吧
                                </p>
                              </div>
                            ) : (
                              chatHistory.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`message-item ${msg.sender}`}
                                >
                                  <div className="message-content">
                                    <div className="message-bubble">
                                      {msg.message}
                                    </div>
                                    <div className="message-time">
                                      {msg.time}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="chat-input">
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
                        <div className="empty-chat-panel">
                          <UserOutlined
                            style={{ fontSize: 64, color: '#d9d9d9' }}
                          />
                          <p>请从左侧选择一个用户开始聊天</p>
                        </div>
                      )}
                    </div>

                    {/* 右侧用户详情 */}
                    <div className="user-detail-panel">
                      {selectedUser ? (
                        <div className="user-detail-content">
                          <div className="detail-body">
                            <div className="detail-section">
                              <h4 className="section-title">基本信息</h4>
                              <div className="detail-grid">
                                <div className="detail-item">
                                  <div className="detail-label">姓名：</div>
                                  <div className="detail-value">
                                    {selectedUser.name}
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div className="detail-label">性别：</div>
                                  <div className="detail-value">
                                    {selectedUser.gender === 'male'
                                      ? '男'
                                      : '女'}
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div className="detail-label">年龄：</div>
                                  <div className="detail-value">
                                    {selectedUser.age}岁
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div className="detail-label">联系方式：</div>
                                  <div className="detail-value">
                                    {selectedUser.phone}
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div className="detail-label">
                                    紧急联系人：
                                  </div>
                                  <div className="detail-value">
                                    {selectedUser.emergencyContact}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4 className="section-title">诊疗信息</h4>
                              <div className="detail-grid">
                                <div className="detail-item">
                                  <div className="detail-label">人群分类：</div>
                                  <Tag
                                    className="category-tag"
                                    color={getCategoryColor(
                                      selectedUser.category,
                                    )}
                                  >
                                    {selectedUser.category}
                                  </Tag>
                                </div>
                                <div className="detail-item">
                                  <div className="detail-label">状态：</div>
                                  <div
                                    className="status-tag"
                                    style={{
                                      border: `1px solid ${getStatusColor(selectedUser.status)}`,
                                      color: getStatusColor(
                                        selectedUser.status,
                                      ),
                                    }}
                                  >
                                    {selectedUser.status === 1
                                      ? '已完成'
                                      : '未完成'}
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div className="detail-label">诊疗评分：</div>
                                  <div className="detail-value score-highlight">
                                    {selectedUser.diagnosisScore}
                                  </div>
                                </div>
                                <div className="detail-item">
                                  <div className="detail-label">
                                    处方日评分：
                                  </div>
                                  <div className="detail-value score-highlight">
                                    {selectedUser.prescriptionScore}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="detail-section">
                              <h4 className="section-title">操作</h4>
                              <Space className="action-items">
                                <div
                                  className="action-item"
                                  onClick={() => handleDetail(selectedUser)}
                                >
                                  <EyeOutlined />
                                  <span>详情</span>
                                </div>
                                <div
                                  className="action-item"
                                  onClick={() => handleDiagnosis(selectedUser)}
                                >
                                  <SwapOutlined />
                                  <span>转诊</span>
                                </div>
                                <div
                                  className="action-item"
                                  onClick={() => handleDiagnosis(selectedUser)}
                                >
                                  <PlayCircleOutlined />
                                  <span>诊断</span>
                                </div>
                                <div
                                  className="action-item"
                                  onClick={() => handleFollowUp(selectedUser)}
                                >
                                  <HomeOutlined />
                                  <span>随访</span>
                                </div>
                              </Space>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <div className="empty-content">
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
                  <div className="chat-pagination">
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
      </div>
    </PageContainer>
  );
};

export default UserList;
