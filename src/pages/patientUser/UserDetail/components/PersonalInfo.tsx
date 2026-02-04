import {
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Input, Modal, message, Select, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import type {
  UserDetailInfo,
  VisitRecord,
} from '@/services/patient-user/typings';
import { getTimeFormat } from '@/utils/constants';

interface PersonalInfoProps {
  userInfo: UserDetailInfo;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  userInfo: initialUserInfo,
}) => {
  const visitTableRef = useRef<ActionType>(null);
  const [userInfo, setUserInfo] = useState<UserDetailInfo>(initialUserInfo);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<VisitRecord | null>(null);

  // 行内编辑状态
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editingPersonalData, setEditingPersonalData] =
    useState<UserDetailInfo>(initialUserInfo);
  const [editingContactData, setEditingContactData] = useState({
    emergencyContactName: initialUserInfo.emergencyContactName,
    emergencyContactRelation: initialUserInfo.emergencyContactRelation,
    emergencyContactPhone: initialUserInfo.emergencyContactPhone,
  });

  // 模拟随访记录数据
  const getVisitRecords = (): VisitRecord[] => {
    return [
      {
        id: '1',
        date: '2013/12/08',
        doctor: '康雄',
        topic: '老年痴呆',
        duration: '20时12分',
        status: 1,
      },
      {
        id: '2',
        date: '2018/04/10',
        doctor: '刘群',
        topic: '老年痴呆',
        duration: '06时56分',
        status: 1,
      },
      {
        id: '3',
        date: '1992/05/22',
        doctor: '江旭',
        topic: '老年痴呆',
        duration: '13时29分',
        status: 1,
      },
      {
        id: '4',
        date: '1992/05/22',
        doctor: '江旭',
        topic: '老年痴呆',
        duration: '22时57分',
        status: 1,
      },
    ];
  };

  // 个人信息编辑
  const handleEditPersonalInfo = () => {
    setEditingPersonalData(userInfo);
    setIsEditingPersonal(true);
  };

  const handleSavePersonalInfo = () => {
    setUserInfo(editingPersonalData);
    setIsEditingPersonal(false);
    message.success('保存成功');
  };

  const handleCancelPersonalEdit = () => {
    setEditingPersonalData(userInfo);
    setIsEditingPersonal(false);
  };

  // 联系人编辑
  const handleEditContact = () => {
    setEditingContactData({
      emergencyContactName: userInfo.emergencyContactName,
      emergencyContactRelation: userInfo.emergencyContactRelation,
      emergencyContactPhone: userInfo.emergencyContactPhone,
    });
    setIsEditingContact(true);
  };

  const handleSaveContact = () => {
    setUserInfo({ ...userInfo, ...editingContactData });
    setIsEditingContact(false);
    message.success('保存成功');
  };

  const handleCancelContactEdit = () => {
    setEditingContactData({
      emergencyContactName: userInfo.emergencyContactName,
      emergencyContactRelation: userInfo.emergencyContactRelation,
      emergencyContactPhone: userInfo.emergencyContactPhone,
    });
    setIsEditingContact(false);
  };

  // 查看随访记录详情
  const handleViewDetail = (record: VisitRecord) => {
    setViewingRecord(record);
    setDetailModalVisible(true);
  };

  // 随访记录列定义
  const visitColumns: ProColumns<VisitRecord>[] = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '随访医生',
      dataIndex: 'doctor',
      width: 100,
    },
    {
      title: '主题',
      dataIndex: 'topic',
      width: 120,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: () => <span className="status-badge completed">已完成</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space className="action-items">
          <div className="action-item" onClick={() => handleViewDetail(record)}>
            <EyeOutlined />
            <span>详情</span>
          </div>
        </Space>
      ),
    },
  ];

  // 获取随访记录数据
  const fetchVisitRecords = async () => {
    const mockData = getVisitRecords();
    return {
      data: mockData,
      success: true,
      total: mockData.length,
    };
  };

  return (
    <div className="tab-content">
      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">住院个人信息</h3>
          {!isEditingPersonal ? (
            <Button
              type="link"
              className="edit-button"
              icon={<EditOutlined />}
              onClick={handleEditPersonalInfo}
            >
              编辑
            </Button>
          ) : (
            <Space>
              <Button
                type="link"
                className="edit-button"
                icon={<SaveOutlined />}
                onClick={handleSavePersonalInfo}
              >
                保存
              </Button>
              <Button
                type="link"
                className="edit-button"
                icon={<CloseOutlined />}
                onClick={handleCancelPersonalEdit}
              >
                取消
              </Button>
            </Space>
          )}
        </div>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">姓名：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.name}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      name: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.name
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">性别：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Select
                  value={editingPersonalData.gender}
                  onChange={(value) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      gender: value,
                    })
                  }
                  style={{ width: '100%' }}
                >
                  <Select.Option value="male">男</Select.Option>
                  <Select.Option value="female">女</Select.Option>
                </Select>
              ) : userInfo.gender === 'male' ? (
                '男'
              ) : (
                '女'
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">出生日期：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <DatePicker
                  value={
                    editingPersonalData.birthday
                      ? dayjs(editingPersonalData.birthday, 'YYYY/MM/DD')
                      : null
                  }
                  onChange={(date) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      birthday: date ? date.format('YYYY/MM/DD') : '',
                    })
                  }
                  format="YYYY/MM/DD"
                  style={{ width: '100%' }}
                />
              ) : (
                getTimeFormat(userInfo.birthday)
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">联系方式：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.phone}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      phone: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.phone
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">饮食习惯：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.drinkingHabit}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      drinkingHabit: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.drinkingHabit
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">生活习惯：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.lifeHabit}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      lifeHabit: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.lifeHabit
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">家族史：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.familyHistory}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      familyHistory: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.familyHistory
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">受教育程度：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.educationLevel}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      educationLevel: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.educationLevel
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">既往病史：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.existingDisease}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      existingDisease: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.existingDisease
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">既往用药：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.existingMedication}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      existingMedication: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.existingMedication
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">职业：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.occupation}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      occupation: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.occupation
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">随访意愿：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.randomIntention}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      randomIntention: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.randomIntention
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">籍贯：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.province}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      province: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.province
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">地址：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.address}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      address: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.address
              )}
            </div>
          </div>
          <div className="info-item full-width">
            <div className="info-label">不良嗜好：</div>
            <div className="info-value">
              {isEditingPersonal ? (
                <Input
                  value={editingPersonalData.notDrugAllergy}
                  onChange={(e) =>
                    setEditingPersonalData({
                      ...editingPersonalData,
                      notDrugAllergy: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.notDrugAllergy
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">联系人</h3>
          {!isEditingContact ? (
            <Button
              type="link"
              className="edit-button"
              icon={<EditOutlined />}
              onClick={handleEditContact}
            >
              编辑
            </Button>
          ) : (
            <Space>
              <Button
                type="link"
                className="edit-button"
                icon={<SaveOutlined />}
                onClick={handleSaveContact}
              >
                保存
              </Button>
              <Button
                type="link"
                className="edit-button"
                icon={<CloseOutlined />}
                onClick={handleCancelContactEdit}
              >
                取消
              </Button>
            </Space>
          )}
        </div>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">姓名：</div>
            <div className="info-value">
              {isEditingContact ? (
                <Input
                  value={editingContactData.emergencyContactName}
                  onChange={(e) =>
                    setEditingContactData({
                      ...editingContactData,
                      emergencyContactName: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.emergencyContactName
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">关系：</div>
            <div className="info-value">
              {isEditingContact ? (
                <Input
                  value={editingContactData.emergencyContactRelation}
                  onChange={(e) =>
                    setEditingContactData({
                      ...editingContactData,
                      emergencyContactRelation: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.emergencyContactRelation
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">联系方式：</div>
            <div className="info-value">
              {isEditingContact ? (
                <Input
                  value={editingContactData.emergencyContactPhone}
                  onChange={(e) =>
                    setEditingContactData({
                      ...editingContactData,
                      emergencyContactPhone: e.target.value,
                    })
                  }
                />
              ) : (
                userInfo.emergencyContactPhone
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">随访记录</h3>
        </div>
        <ProTable<VisitRecord>
          actionRef={visitTableRef}
          rowKey="id"
          search={false}
          options={{
            reload: false,
            density: false,
            fullScreen: false,
            setting: false,
          }}
          request={fetchVisitRecords}
          columns={visitColumns}
          pagination={{
            pageSize: 5,
          }}
          className="visit-pro-table"
        />
      </div>

      {/* 随访记录详情弹窗 */}
      <Modal
        title="随访记录详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {viewingRecord && (
          <div>
            <p>
              <strong>日期：</strong>
              {viewingRecord.date}
            </p>
            <p>
              <strong>随访医生：</strong>
              {viewingRecord.doctor}
            </p>
            <p>
              <strong>主题：</strong>
              {viewingRecord.topic}
            </p>
            <p>
              <strong>时长：</strong>
              {viewingRecord.duration}
            </p>
            <p>
              <strong>状态：</strong>
              <span className="status-badge completed">已完成</span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PersonalInfo;
