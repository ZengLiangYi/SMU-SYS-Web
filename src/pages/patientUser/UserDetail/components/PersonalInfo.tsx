import {
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  App,
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { getFollowups, updatePatient } from '@/services/patient-user';
import type {
  FollowupListItem,
  PatientContact,
  PatientDetail,
} from '@/services/patient-user/typings.d';
import { formatDateTime } from '@/utils/date';
import useComponentStyles from './components.style';

const { Title, Text } = Typography;

interface PersonalInfoProps {
  patientId: string;
  patientDetail: PatientDetail;
  onSaved?: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  patientId,
  patientDetail,
  onSaved,
}) => {
  const { styles, cx } = useComponentStyles();
  const { message } = App.useApp();
  const visitTableRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<FollowupListItem | null>(
    null,
  );

  // -------- 行内编辑状态 --------
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editData, setEditData] = useState({
    name: patientDetail.name,
    gender: patientDetail.gender,
    birth_date: patientDetail.birth_date,
    phone: patientDetail.phone,
    diet_habits: patientDetail.diet_habits ?? '',
    lifestyle_habits: patientDetail.lifestyle_habits ?? '',
    family_history: patientDetail.family_history ?? '',
    education_level: patientDetail.education_level ?? '',
    medical_history: patientDetail.medical_history ?? '',
    medication_history: patientDetail.medication_history ?? '',
    occupation: patientDetail.occupation ?? '',
    followup_willing: patientDetail.followup_willing,
    native_place: patientDetail.native_place ?? '',
    address: patientDetail.address ?? '',
    bad_habits: patientDetail.bad_habits ?? '',
  });
  const firstContact: PatientContact | undefined = patientDetail.contacts?.[0];
  const [editContact, setEditContact] = useState<PatientContact>({
    name: firstContact?.name ?? '',
    relation: firstContact?.relation ?? '',
    phone: firstContact?.phone ?? '',
  });

  // -------- 更新 API --------
  const { run: runUpdate, loading: saving } = useRequest(
    (data: Record<string, any>) => updatePatient(patientId, data),
    {
      manual: true,
      onSuccess: () => {
        message.success('保存成功');
        onSaved?.();
      },
    },
  );

  // -------- 个人信息编辑 --------
  const handleSavePersonalInfo = () => {
    runUpdate(editData);
    setIsEditingPersonal(false);
  };

  const handleCancelPersonalEdit = () => {
    setEditData({
      name: patientDetail.name,
      gender: patientDetail.gender,
      birth_date: patientDetail.birth_date,
      phone: patientDetail.phone,
      diet_habits: patientDetail.diet_habits ?? '',
      lifestyle_habits: patientDetail.lifestyle_habits ?? '',
      family_history: patientDetail.family_history ?? '',
      education_level: patientDetail.education_level ?? '',
      medical_history: patientDetail.medical_history ?? '',
      medication_history: patientDetail.medication_history ?? '',
      occupation: patientDetail.occupation ?? '',
      followup_willing: patientDetail.followup_willing,
      native_place: patientDetail.native_place ?? '',
      address: patientDetail.address ?? '',
      bad_habits: patientDetail.bad_habits ?? '',
    });
    setIsEditingPersonal(false);
  };

  // -------- 联系人编辑 --------
  const handleSaveContact = () => {
    runUpdate({ contacts: [editContact] });
    setIsEditingContact(false);
  };

  const handleCancelContactEdit = () => {
    setEditContact({
      name: firstContact?.name ?? '',
      relation: firstContact?.relation ?? '',
      phone: firstContact?.phone ?? '',
    });
    setIsEditingContact(false);
  };

  // -------- 随访记录 --------
  const visitColumns: ProColumns<FollowupListItem>[] = [
    {
      title: '日期',
      dataIndex: 'created_at',
      width: 160,
      render: (_, record) => formatDateTime(record.created_at),
    },
    {
      title: '随访医生',
      dataIndex: 'doctor_name',
      width: 100,
      render: (_, record) => record.doctor_name ?? '--',
    },
    {
      title: '主题',
      dataIndex: 'subject',
      width: 120,
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration_minutes',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'is_completed',
      width: 100,
      render: (_, record) => (
        <Tag color={record.is_completed ? 'blue' : 'red'}>
          {record.is_completed ? '已完成' : '未完成'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setViewingRecord(record);
            setDetailModalVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  const fetchVisitRecords = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize = 5 } = params;
    try {
      const { data } = await getFollowups(patientId, {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
      return { data: data.items, total: data.total, success: true };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  // -------- 信息字段渲染辅助 --------
  const renderField = (
    label: string,
    value: string,
    key: string,
    fullWidth = false,
  ) => (
    <div
      className={cx(styles.infoItem, fullWidth && styles.infoItemFullWidth)}
      key={key}
    >
      <Text className={styles.infoLabel}>{label}：</Text>
      <div className={styles.infoValue}>
        {isEditingPersonal ? (
          <Input
            value={(editData as any)[key] ?? ''}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, [key]: e.target.value }))
            }
          />
        ) : (
          value || '--'
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.tabContent}>
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            住院个人信息
          </Title>
          {!isEditingPersonal ? (
            <Button
              type="link"
              className="edit-button"
              icon={<EditOutlined />}
              onClick={() => setIsEditingPersonal(true)}
            >
              编辑
            </Button>
          ) : (
            <Space>
              <Button
                type="link"
                className="edit-button"
                icon={<SaveOutlined />}
                loading={saving}
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
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Text className={styles.infoLabel}>姓名：</Text>
            <div className={styles.infoValue}>
              {isEditingPersonal ? (
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              ) : (
                patientDetail.name
              )}
            </div>
          </div>
          <div className={styles.infoItem}>
            <Text className={styles.infoLabel}>性别：</Text>
            <div className={styles.infoValue}>
              {isEditingPersonal ? (
                <Select
                  value={editData.gender}
                  onChange={(value) =>
                    setEditData((prev) => ({ ...prev, gender: value }))
                  }
                  style={{ width: '100%' }}
                >
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              ) : (
                patientDetail.gender
              )}
            </div>
          </div>
          <div className={styles.infoItem}>
            <Text className={styles.infoLabel}>出生日期：</Text>
            <div className={styles.infoValue}>
              {isEditingPersonal ? (
                <DatePicker
                  value={
                    editData.birth_date ? dayjs(editData.birth_date) : null
                  }
                  onChange={(date) =>
                    setEditData((prev) => ({
                      ...prev,
                      birth_date: date ? date.format('YYYY-MM-DD') : '',
                    }))
                  }
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              ) : (
                patientDetail.birth_date || '--'
              )}
            </div>
          </div>
          {renderField('联系方式', patientDetail.phone, 'phone')}
          {renderField(
            '饮食习惯',
            patientDetail.diet_habits ?? '',
            'diet_habits',
          )}
          {renderField(
            '生活习惯',
            patientDetail.lifestyle_habits ?? '',
            'lifestyle_habits',
          )}
          {renderField(
            '家族史',
            patientDetail.family_history ?? '',
            'family_history',
          )}
          {renderField(
            '受教育程度',
            patientDetail.education_level ?? '',
            'education_level',
          )}
          {renderField(
            '既往病史',
            patientDetail.medical_history ?? '',
            'medical_history',
          )}
          {renderField(
            '既往用药',
            patientDetail.medication_history ?? '',
            'medication_history',
          )}
          {renderField('职业', patientDetail.occupation ?? '', 'occupation')}
          <div className={styles.infoItem}>
            <Text className={styles.infoLabel}>随访意愿：</Text>
            <div className={styles.infoValue}>
              {isEditingPersonal ? (
                <Select
                  value={editData.followup_willing}
                  onChange={(value) =>
                    setEditData((prev) => ({
                      ...prev,
                      followup_willing: value,
                    }))
                  }
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value={true}>愿意</Select.Option>
                  <Select.Option value={false}>不愿意</Select.Option>
                </Select>
              ) : patientDetail.followup_willing != null ? (
                patientDetail.followup_willing ? (
                  '愿意'
                ) : (
                  '不愿意'
                )
              ) : (
                '--'
              )}
            </div>
          </div>
          {renderField(
            '籍贯',
            patientDetail.native_place ?? '',
            'native_place',
          )}
          {renderField('地址', patientDetail.address ?? '', 'address')}
          {renderField(
            '不良嗜好',
            patientDetail.bad_habits ?? '',
            'bad_habits',
            true,
          )}
        </div>
      </div>

      {/* 联系人 */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            联系人
          </Title>
          {!isEditingContact ? (
            <Button
              type="link"
              className="edit-button"
              icon={<EditOutlined />}
              onClick={() => setIsEditingContact(true)}
            >
              编辑
            </Button>
          ) : (
            <Space>
              <Button
                type="link"
                className="edit-button"
                icon={<SaveOutlined />}
                loading={saving}
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
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Text className={styles.infoLabel}>姓名：</Text>
            <div className={styles.infoValue}>
              {isEditingContact ? (
                <Input
                  value={editContact.name}
                  onChange={(e) =>
                    setEditContact((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              ) : (
                (firstContact?.name ?? '--')
              )}
            </div>
          </div>
          <div className={styles.infoItem}>
            <Text className={styles.infoLabel}>关系：</Text>
            <div className={styles.infoValue}>
              {isEditingContact ? (
                <Input
                  value={editContact.relation}
                  onChange={(e) =>
                    setEditContact((prev) => ({
                      ...prev,
                      relation: e.target.value,
                    }))
                  }
                />
              ) : (
                (firstContact?.relation ?? '--')
              )}
            </div>
          </div>
          <div className={styles.infoItem}>
            <Text className={styles.infoLabel}>联系方式：</Text>
            <div className={styles.infoValue}>
              {isEditingContact ? (
                <Input
                  value={editContact.phone}
                  onChange={(e) =>
                    setEditContact((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              ) : (
                (firstContact?.phone ?? '--')
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 随访记录 */}
      <div className={styles.infoSection}>
        <div className={styles.sectionHeader}>
          <Title level={5} className={styles.sectionTitle}>
            随访记录
          </Title>
        </div>
        <ProTable<FollowupListItem>
          actionRef={visitTableRef}
          rowKey="id"
          search={false}
          options={false}
          request={fetchVisitRecords}
          columns={visitColumns}
          pagination={{ defaultPageSize: 5, showSizeChanger: true }}
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
              {formatDateTime(viewingRecord.created_at)}
            </p>
            <p>
              <strong>随访医生：</strong>
              {viewingRecord.doctor_name ?? '--'}
            </p>
            <p>
              <strong>主题：</strong>
              {viewingRecord.subject}
            </p>
            <p>
              <strong>时长：</strong>
              {viewingRecord.duration_minutes}分钟
            </p>
            <p>
              <strong>状态：</strong>
              <Tag color={viewingRecord.is_completed ? 'blue' : 'red'}>
                {viewingRecord.is_completed ? '已完成' : '未完成'}
              </Tag>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PersonalInfo;
