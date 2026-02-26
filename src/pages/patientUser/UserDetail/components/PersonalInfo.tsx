import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  ProDescriptions,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  App,
  Button,
  Empty,
  Flex,
  List,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import EditPatientDrawer from '@/components/EditPatientDrawer';
import { getFollowups, updatePatient } from '@/services/patient-user';
import type {
  FollowupListItem,
  PatientContact,
  PatientDetail,
} from '@/services/patient-user/typings.d';
import { formatDateTime } from '@/utils/date';

const { Title, Text } = Typography;
const PAGE_SIZE = 5;

interface PersonalInfoProps {
  patientId: string;
  patientDetail: PatientDetail;
  onSaved?: () => void;
}

const personalColumns: ProDescriptionsItemProps<PatientDetail>[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '性别', dataIndex: 'gender' },
  { title: '出生日期', dataIndex: 'birth_date', valueType: 'date' },
  { title: '联系方式', dataIndex: 'phone' },
  { title: '饮食习惯', dataIndex: 'diet_habits' },
  { title: '生活习惯', dataIndex: 'lifestyle_habits' },
  { title: '家族史', dataIndex: 'family_history' },
  { title: '受教育程度', dataIndex: 'education_level' },
  { title: '既往病史', dataIndex: 'medical_history' },
  { title: '既往用药', dataIndex: 'medication_history' },
  { title: '职业', dataIndex: 'occupation' },
  {
    title: '随访意愿',
    dataIndex: 'followup_willing',
    render: (_, entity) =>
      entity.followup_willing != null
        ? entity.followup_willing
          ? '愿意'
          : '不愿意'
        : '--',
  },
  { title: '籍贯', dataIndex: 'native_place' },
  { title: '地址', dataIndex: 'address' },
  { title: '不良嗜好', dataIndex: 'bad_habits', span: 2 },
];

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  patientId,
  patientDetail,
  onSaved,
}) => {
  const { message } = App.useApp();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<FollowupListItem | null>(
    null,
  );
  const [followupPage, setFollowupPage] = useState(1);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(
    null,
  );
  const [editingContact, setEditingContact] = useState<
    PatientContact | undefined
  >(undefined);

  const contacts = patientDetail.contacts ?? [];

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

  const { data: followupData, loading: followupLoading } = useRequest(
    () =>
      getFollowups(patientId, {
        offset: (followupPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, followupPage] },
  );

  const followupItems = followupData?.items ?? [];

  // -------- Contact CRUD --------
  const openContactModal = (index: number | null) => {
    setEditingContactIndex(index);
    setEditingContact(index !== null ? { ...contacts[index] } : undefined);
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setEditingContactIndex(null);
    setEditingContact(undefined);
  };

  const handleContactSave = async (values: PatientContact) => {
    const latest = patientDetail.contacts ?? [];
    const next = [...latest];
    if (editingContactIndex !== null) {
      next[editingContactIndex] = values;
    } else {
      next.push(values);
    }
    await runUpdate({ contacts: next });
    return true;
  };

  const handleContactDelete = (index: number) => {
    runUpdate({ contacts: contacts.filter((_, i) => i !== index) });
  };

  return (
    <div>
      {/* -------- 个人信息（只读 + DrawerForm 分组编辑） -------- */}
      <ProDescriptions<PatientDetail>
        title="住院个人信息"
        dataSource={patientDetail}
        columns={personalColumns}
        column={2}
        extra={
          <EditPatientDrawer
            patientId={patientId}
            patientDetail={patientDetail}
            onSaved={onSaved}
            trigger={
              <Button
                type="link"
                icon={<EditOutlined />}
                aria-label="编辑个人信息"
              >
                编辑
              </Button>
            }
          />
        }
      />

      {/* -------- 联系人（List CRUD） -------- */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginTop: 24, marginBottom: 12 }}
      >
        <Title level={5} style={{ margin: 0 }}>
          联系人
        </Title>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => openContactModal(null)}
          aria-label="添加联系人"
        >
          添加联系人
        </Button>
      </Flex>
      {contacts.length > 0 ? (
        <List
          dataSource={contacts}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              actions={[
                <Button
                  key="edit"
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  aria-label={`编辑${item.name}`}
                  onClick={() => openContactModal(index)}
                />,
                <Popconfirm
                  key="delete"
                  title="确认删除该联系人？"
                  onConfirm={() => handleContactDelete(index)}
                >
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    aria-label={`删除${item.name}`}
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`关系：${item.relation}`}
              />
              <Text type="secondary">{item.phone}</Text>
            </List.Item>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无联系人" />
      )}
      <ModalForm<PatientContact>
        title={editingContactIndex !== null ? '编辑联系人' : '添加联系人'}
        open={contactModalOpen}
        onOpenChange={(open) => {
          if (!open) closeContactModal();
        }}
        initialValues={editingContact ?? { name: '', relation: '', phone: '' }}
        modalProps={{ destroyOnHidden: true }}
        loading={saving}
        onFinish={handleContactSave}
      >
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        <ProFormText
          name="relation"
          label="关系"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="phone"
          label="联系方式"
          rules={[{ required: true }]}
        />
      </ModalForm>

      {/* -------- 随访记录 -------- */}
      <Title level={5} style={{ marginTop: 24 }}>
        随访记录
      </Title>
      <Spin spinning={followupLoading}>
        {followupItems.length > 0 ? (
          <>
            <List<FollowupListItem>
              dataSource={followupItems}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  extra={
                    <Button
                      type="link"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        setViewingRecord(item);
                        setDetailModalVisible(true);
                      }}
                      aria-label="查看随访详情"
                    >
                      详情
                    </Button>
                  }
                >
                  <List.Item.Meta
                    title={item.subject}
                    description={
                      <Flex gap={8} align="center" wrap>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDateTime(item.created_at)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.doctor_name ?? '--'} · {item.duration_minutes}
                          分钟
                        </Text>
                        <Tag color={item.is_completed ? 'blue' : 'red'}>
                          {item.is_completed ? '已完成' : '未完成'}
                        </Tag>
                      </Flex>
                    }
                  />
                </List.Item>
              )}
            />
            {(followupData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end" style={{ marginTop: 8 }}>
                <Pagination
                  size="small"
                  current={followupPage}
                  pageSize={PAGE_SIZE}
                  total={followupData?.total ?? 0}
                  onChange={setFollowupPage}
                  showSizeChanger={false}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无随访记录" />
        )}
      </Spin>

      {/* -------- 随访详情弹窗 -------- */}
      <Modal
        title="随访记录详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        destroyOnHidden
        footer={[
          <Button
            key="close"
            onClick={() => setDetailModalVisible(false)}
            aria-label="关闭"
          >
            关闭
          </Button>,
        ]}
        width={600}
      >
        {viewingRecord && (
          <ProDescriptions<FollowupListItem>
            dataSource={viewingRecord}
            column={1}
            columns={[
              {
                title: '日期',
                dataIndex: 'created_at',
                render: (_, entity) => formatDateTime(entity.created_at),
              },
              {
                title: '随访医生',
                dataIndex: 'doctor_name',
                render: (_, entity) => entity.doctor_name ?? '--',
              },
              { title: '主题', dataIndex: 'subject' },
              {
                title: '时长',
                dataIndex: 'duration_minutes',
                render: (_, entity) => `${entity.duration_minutes}分钟`,
              },
              {
                title: '状态',
                dataIndex: 'is_completed',
                render: (_, entity) => (
                  <Tag color={entity.is_completed ? 'blue' : 'red'}>
                    {entity.is_completed ? '已完成' : '未完成'}
                  </Tag>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default PersonalInfo;
