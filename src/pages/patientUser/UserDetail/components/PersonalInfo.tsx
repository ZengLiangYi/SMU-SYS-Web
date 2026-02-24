import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  ProDescriptions,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
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
  Spin,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
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

// -------- 个人信息字段描述 --------
const personalColumns: ProDescriptionsItemProps<PatientDetail>[] = [
  { title: '姓名', dataIndex: 'name' },
  {
    title: '性别',
    dataIndex: 'gender',
  },
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

// -------- 联系人字段描述 --------
const contactColumns: ProDescriptionsItemProps<PatientContact>[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '关系', dataIndex: 'relation' },
  { title: '联系方式', dataIndex: 'phone' },
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

  const firstContact: PatientContact | undefined = patientDetail.contacts?.[0];

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

  return (
    <div>
      {/* -------- 个人信息（只读 + ModalForm 编辑） -------- */}
      <ProDescriptions<PatientDetail>
        title="住院个人信息"
        dataSource={patientDetail}
        columns={personalColumns}
        column={2}
        extra={
          <ModalForm
            title="编辑个人信息"
            trigger={
              <Button type="link" icon={<EditOutlined />}>
                编辑
              </Button>
            }
            initialValues={{
              ...patientDetail,
              diet_habits: patientDetail.diet_habits ?? '',
              lifestyle_habits: patientDetail.lifestyle_habits ?? '',
              family_history: patientDetail.family_history ?? '',
              education_level: patientDetail.education_level ?? '',
              medical_history: patientDetail.medical_history ?? '',
              medication_history: patientDetail.medication_history ?? '',
              occupation: patientDetail.occupation ?? '',
              native_place: patientDetail.native_place ?? '',
              address: patientDetail.address ?? '',
              bad_habits: patientDetail.bad_habits ?? '',
              followup_willing:
                patientDetail.followup_willing != null
                  ? String(patientDetail.followup_willing)
                  : undefined,
            }}
            modalProps={{ destroyOnHidden: true }}
            loading={saving}
            onFinish={async (values) => {
              await runUpdate(values);
              return true;
            }}
          >
            <ProFormText
              name="name"
              label="姓名"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="gender"
              label="性别"
              options={[
                { label: '男', value: '男' },
                { label: '女', value: '女' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="birth_date"
              label="出生日期"
              rules={[{ required: true }]}
              transform={(value: string) => ({
                birth_date: value ? dayjs(value).format('YYYY-MM-DD') : '',
              })}
            />
            <ProFormText
              name="phone"
              label="联系方式"
              rules={[{ required: true }]}
            />
            <ProFormText name="diet_habits" label="饮食习惯" />
            <ProFormText name="lifestyle_habits" label="生活习惯" />
            <ProFormText name="family_history" label="家族史" />
            <ProFormText name="education_level" label="受教育程度" />
            <ProFormTextArea name="medical_history" label="既往病史" />
            <ProFormTextArea name="medication_history" label="既往用药" />
            <ProFormText name="occupation" label="职业" />
            <ProFormSelect
              name="followup_willing"
              label="随访意愿"
              options={[
                { label: '愿意', value: 'true' },
                { label: '不愿意', value: 'false' },
              ]}
              allowClear
              transform={(value) => ({
                followup_willing:
                  value === 'true'
                    ? true
                    : value === 'false'
                      ? false
                      : undefined,
              })}
            />
            <ProFormText name="native_place" label="籍贯" />
            <ProFormText name="address" label="地址" />
            <ProFormTextArea name="bad_habits" label="不良嗜好" />
          </ModalForm>
        }
      />

      {/* -------- 联系人（只读 + ModalForm 编辑） -------- */}
      <ProDescriptions<PatientContact>
        title="联系人"
        dataSource={firstContact ?? { name: '', relation: '', phone: '' }}
        columns={contactColumns}
        column={3}
        style={{ marginTop: 24 }}
        extra={
          <ModalForm
            title="编辑联系人"
            trigger={
              <Button type="link" icon={<EditOutlined />}>
                编辑
              </Button>
            }
            initialValues={{
              contact_name: firstContact?.name ?? '',
              contact_relation: firstContact?.relation ?? '',
              contact_phone: firstContact?.phone ?? '',
            }}
            modalProps={{ destroyOnHidden: true }}
            loading={saving}
            onFinish={async (values) => {
              await runUpdate({
                contacts: [
                  {
                    name: values.contact_name,
                    relation: values.contact_relation,
                    phone: values.contact_phone,
                  },
                ],
              });
              return true;
            }}
          >
            <ProFormText
              name="contact_name"
              label="姓名"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="contact_relation"
              label="关系"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="contact_phone"
              label="联系方式"
              rules={[{ required: true }]}
            />
          </ModalForm>
        }
      />

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
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
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
