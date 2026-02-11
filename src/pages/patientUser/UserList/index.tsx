import {
  CloseCircleOutlined,
  EyeOutlined,
  HomeOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  SwapOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { App, Button, Space, Tag } from 'antd';
import React, { Suspense, useRef, useState } from 'react';
import {
  cancelBindRequest,
  createBindRequest,
  getBindRequests,
} from '@/services/bind-request';
import { createConversation } from '@/services/chat';
import { getPatients } from '@/services/patient-user';
import type { PatientListItem } from '@/services/patient-user/typings.d';
import { CROWD_CATEGORY_ENUM, getCategoryColor } from '@/utils/constants';

const CreateFollowupForm = React.lazy(
  () => import('../UserDetail/components/CreateFollowupForm'),
);
const CreateReferralForm = React.lazy(
  () => import('../UserDetail/components/CreateReferralForm'),
);

const UserList: React.FC = () => {
  const { message, modal } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDoctorId = initialState?.currentUser?.id;
  const actionRef = useRef<ActionType>(null);
  const [isBound, setIsBound] = useState<boolean>(true); // 默认显示已绑定患者
  const [followupOpen, setFollowupOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [activePatientId, setActivePatientId] = useState<string>('');
  // Map<patient_id, bind_request_id>: 当前医生对未绑定患者的待处理绑定请求
  const [pendingBindMap, setPendingBindMap] = useState<Map<string, string>>(
    () => new Map(),
  );

  // -------- 绑定患者 --------
  const handleBind = (patientId: string, patientName: string) => {
    modal.confirm({
      title: '绑定患者',
      content: `确认向患者「${patientName}」发起绑定请求？`,
      okText: '确认绑定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await createBindRequest({ patient_id: patientId });
          message.success('绑定请求已发送，等待患者确认');
          actionRef.current?.reload();
        } catch (err: any) {
          message.error(err?.data?.msg || '绑定请求发送失败');
        }
      },
    });
  };

  // -------- 撤销绑定请求 --------
  const handleCancelBind = (requestId: string, patientName: string) => {
    modal.confirm({
      title: '撤销绑定请求',
      content: `确认撤销对患者「${patientName}」的绑定请求？`,
      okText: '确认撤销',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          await cancelBindRequest(requestId);
          message.success('绑定请求已撤销');
          actionRef.current?.reload();
        } catch (err: any) {
          message.error(err?.data?.msg || '撤销失败');
        }
      },
    });
  };

  // -------- 共享基础列 --------
  const baseColumns: ProColumns<PatientListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      fixed: 'left',
      fieldProps: { placeholder: '请输入姓名…' },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 60,
      search: false,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 60,
      search: false,
      render: (_, record) => (record.age != null ? `${record.age}岁` : '--'),
    },
    {
      title: '联系人',
      dataIndex: 'contact_name',
      width: 80,
      search: false,
      render: (_, record) => record.contact_name ?? '--',
    },
    {
      title: '人群分类',
      dataIndex: 'categories',
      width: 160,
      valueType: 'select',
      valueEnum: CROWD_CATEGORY_ENUM,
      fieldProps: { placeholder: '请选择分类…' },
      render: (_, record) =>
        record.categories?.length > 0
          ? record.categories.map((cat) => (
              <Tag
                key={cat}
                color={getCategoryColor(cat)}
                style={{ borderRadius: 12 }}
              >
                {cat}
              </Tag>
            ))
          : '--',
    },
  ];

  // -------- 仅已绑定患者显示的列（评分/诊断状态） --------
  const boundOnlyColumns: ProColumns<PatientListItem>[] = [
    {
      title: '诊疗评分',
      dataIndex: 'treatment_score',
      width: 80,
      search: false,
      render: (_, record) => record.treatment_score ?? '--',
    },
    {
      title: '处方日评分',
      dataIndex: 'prescription_daily_score',
      width: 90,
      search: false,
      render: (_, record) => record.prescription_daily_score ?? '--',
    },
    {
      title: '诊断状态',
      dataIndex: 'diagnosis_status',
      width: 80,
      search: false,
      render: (_, record) =>
        record.diagnosis_status ? <Tag>{record.diagnosis_status}</Tag> : '--',
    },
  ];

  // -------- 发起聊天 --------
  const handleChat = async (patientId: string) => {
    try {
      const { data } = await createConversation({ patient_id: patientId });
      history.push(`/patient-user/chat?conversationId=${data.id}`);
    } catch (err: any) {
      message.error(err?.data?.msg || '发起聊天失败');
    }
  };

  // -------- 已绑定患者操作列 --------
  const boundActionColumn: ProColumns<PatientListItem> = {
    title: '操作',
    key: 'action',
    width: 240,
    fixed: 'right',
    search: false,
    render: (_, record) => (
      <Space>
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => history.push(`/patient-user/detail/${record.id}`)}
        >
          详情
        </Button>
        <Button
          type="link"
          size="small"
          icon={<MessageOutlined />}
          onClick={() => handleChat(record.id)}
        >
          聊天
        </Button>
        <Button
          type="link"
          size="small"
          icon={<SwapOutlined />}
          onClick={() => {
            setActivePatientId(record.id);
            setReferralOpen(true);
          }}
        >
          转诊
        </Button>
        <Button
          type="link"
          size="small"
          icon={<PlayCircleOutlined />}
          onClick={() =>
            history.push(`/patient-user/diagnosis?id=${record.id}`)
          }
        >
          诊断
        </Button>
        <Button
          type="link"
          size="small"
          icon={<HomeOutlined />}
          onClick={() => {
            setActivePatientId(record.id);
            setFollowupOpen(true);
          }}
        >
          随访
        </Button>
      </Space>
    ),
  };

  // -------- 未绑定患者操作列（绑定 / 撤销绑定） --------
  const unboundActionColumn: ProColumns<PatientListItem> = {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    search: false,
    render: (_, record) => {
      const pendingRequestId = pendingBindMap.get(record.id);
      // rendering-conditional-render: ternary, not &&
      return pendingRequestId ? (
        <Button
          type="link"
          size="small"
          danger
          icon={<CloseCircleOutlined />}
          onClick={() => handleCancelBind(pendingRequestId, record.name)}
        >
          撤销绑定
        </Button>
      ) : (
        <Button
          type="link"
          size="small"
          icon={<UserAddOutlined />}
          onClick={() => handleBind(record.id, record.name)}
        >
          绑定
        </Button>
      );
    },
  };

  // -------- 根据 isBound 派生最终列（rerender-derived-state-no-effect） --------
  const columns: ProColumns<PatientListItem>[] = isBound
    ? [...baseColumns, ...boundOnlyColumns, boundActionColumn]
    : [...baseColumns, unboundActionColumn];

  // -------- 列表请求 --------
  const fetchList = async (params: {
    current?: number;
    pageSize?: number;
    name?: string;
    categories?: string;
  }) => {
    const { current = 1, pageSize = 10 } = params;
    const offset = (current - 1) * pageSize;
    try {
      // js-early-exit: 已绑定 tab 无需查询绑定请求
      if (isBound) {
        const { data } = await getPatients({
          offset,
          limit: pageSize,
          is_bound: true,
        });
        return { data: data.items, total: data.total, success: true };
      }
      // async-parallel: 未绑定 tab 并行获取患者列表 + 待处理绑定请求
      const [patientsRes, bindRes] = await Promise.all([
        getPatients({ offset, limit: pageSize, is_bound: false }),
        getBindRequests({ status: 'pending', limit: 100 }),
      ]);
      // js-set-map-lookups: 构建 Map<patient_id, request_id>，仅匹配当前医生
      const map = new Map<string, string>();
      for (const req of bindRes.data.items) {
        if (req.doctor_id === currentDoctorId) {
          map.set(req.patient_id, req.id);
        }
      }
      setPendingBindMap(map);
      return {
        data: patientsRes.data.items,
        total: patientsRes.data.total,
        success: true,
      };
    } catch {
      return { data: [], total: 0, success: false };
    }
  };

  return (
    <PageContainer>
      <ProTable<PatientListItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        request={fetchList}
        columns={columns}
        scroll={{ x: isBound ? 1300 : 800 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        toolbar={{
          menu: {
            type: 'inline',
            activeKey: isBound ? 'bound' : 'unbound',
            items: [
              { key: 'bound', label: '我的患者' },
              { key: 'unbound', label: '未绑定患者' },
            ],
            onChange: (key) => {
              const newIsBound = key === 'bound';
              setIsBound(newIsBound);
              actionRef.current?.reload(); // 切换时重新加载列表
            },
          },
        }}
      />

      <Suspense fallback={null}>
        <CreateFollowupForm
          patientId={activePatientId}
          open={followupOpen}
          onOpenChange={setFollowupOpen}
          onOk={() => setFollowupOpen(false)}
        />
        <CreateReferralForm
          patientId={activePatientId}
          open={referralOpen}
          onOpenChange={setReferralOpen}
          onOk={() => {
            setReferralOpen(false);
            actionRef.current?.reload();
          }}
        />
      </Suspense>
    </PageContainer>
  );
};

export default UserList;
