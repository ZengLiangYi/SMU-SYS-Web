import { UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Conversations } from '@ant-design/x';
import { useRequest, useSearchParams } from '@umijs/max';
import { App, Avatar, Badge, Empty, Flex, Spin, Splitter } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import {
  createConversation,
  getConversations,
  markConversationRead,
} from '@/services/chat';
import type {
  ConversationListItem,
  ConversationListResult,
} from '@/services/chat/typings.d';
import { getPatients } from '@/services/patient-user';
import type {
  PatientListItem,
  PatientListResult,
} from '@/services/patient-user/typings.d';
import { useSocket } from '@/services/websocket/useSocket';
import ChatPanel from './components/ChatPanel';

const UserChat: React.FC = () => {
  const { message: antMessage } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activePatientId, setActivePatientId] = useState<string | null>(() =>
    searchParams.get('patientId'),
  );
  const [activeConvId, setActiveConvId] = useState<string | null>(() =>
    searchParams.get('conversationId'),
  );

  // -------- 加载患者列表 + 会话列表（两个 useRequest 并行发起）--------
  const { data: patientsData, loading: pLoading } = useRequest(() =>
    getPatients({ is_bound: true, limit: 100 }),
  );

  const {
    data: convsData,
    loading: cLoading,
    refresh: refreshConvs,
  } = useRequest(() => getConversations({ limit: 100 }));

  const dataLoading = pLoading || cLoading;
  // useRequest 自动提取 ApiResponse.data，得到 PatientListResult / ConversationListResult
  const patients: PatientListItem[] =
    (patientsData as PatientListResult | undefined)?.items ?? [];
  const conversations: ConversationListItem[] =
    (convsData as ConversationListResult | undefined)?.items ?? [];

  // -------- 会话映射：patient_id -> ConversationListItem（js-set-map-lookups）--------
  const convByPatientMap = useMemo(() => {
    const map = new Map<string, ConversationListItem>();
    for (const conv of conversations) {
      map.set(conv.patient_id, conv);
    }
    return map;
  }, [conversations]);

  // -------- 患者列表排序：有会话的按 last_message_at 降序，无会话的保持原序（js-tosorted-immutable）--------
  const sortedPatients = useMemo(() => {
    const withConv: PatientListItem[] = [];
    const withoutConv: PatientListItem[] = [];
    for (const p of patients) {
      if (convByPatientMap.has(p.id)) {
        withConv.push(p);
      } else {
        withoutConv.push(p);
      }
    }
    // 有会话的按 last_message_at 降序
    const sortedWithConv = withConv.toSorted((a, b) => {
      const convA = convByPatientMap.get(a.id);
      const convB = convByPatientMap.get(b.id);
      const timeA = convA?.last_message_at
        ? new Date(convA.last_message_at).getTime()
        : 0;
      const timeB = convB?.last_message_at
        ? new Date(convB.last_message_at).getTime()
        : 0;
      return timeB - timeA;
    });
    return [...sortedWithConv, ...withoutConv];
  }, [patients, convByPatientMap]);

  // -------- 映射为 Conversations 列表项 --------
  const patientItems = useMemo(
    () =>
      sortedPatients.map((p) => {
        const conv = convByPatientMap.get(p.id);
        const unread = conv?.unread_count ?? 0;
        return {
          key: p.id, // 使用 patient_id 作为 key
          label: p.name,
          description: conv?.last_message_at
            ? dayjs(conv.last_message_at).format('MM-DD HH:mm')
            : undefined,
          icon:
            unread > 0 ? (
              <Badge count={unread} size="small">
                <Avatar size="small" icon={<UserOutlined />} />
              </Badge>
            ) : (
              <Avatar size="small" icon={<UserOutlined />} />
            ),
        };
      }),
    [sortedPatients, convByPatientMap],
  );

  // -------- 选择患者 --------
  const handlePatientSelect = useCallback(
    async (patientId: string) => {
      setActivePatientId(patientId);
      const existingConv = convByPatientMap.get(patientId);
      if (existingConv) {
        // 已有会话，直接激活
        setActiveConvId(existingConv.id);
        setSearchParams({ patientId, conversationId: existingConv.id });
        markConversationRead(existingConv.id).catch(() => {});
      } else {
        // 无会话，创建新会话
        try {
          const { data } = await createConversation({ patient_id: patientId });
          setActiveConvId(data.id);
          setSearchParams({ patientId, conversationId: data.id });
          refreshConvs();
        } catch {
          antMessage.error('创建会话失败');
        }
      }
    },
    [convByPatientMap, setSearchParams, refreshConvs, antMessage],
  );

  // -------- URL query 同步：支持从外部跳入 --------
  // 如果 URL 有 conversationId 但没有 patientId，从会话列表反查
  React.useEffect(() => {
    const urlConvId = searchParams.get('conversationId');
    const urlPatientId = searchParams.get('patientId');
    if (urlConvId && !urlPatientId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === urlConvId);
      if (conv) {
        setActivePatientId(conv.patient_id);
        setActiveConvId(conv.id);
      }
    }
  }, [searchParams, conversations]);

  // -------- WebSocket：收到新消息刷新会话列表 --------
  useSocket('message:new', () => {
    refreshConvs();
  });

  // -------- 当前选中的患者信息 --------
  const activePatient = useMemo(
    () =>
      activePatientId
        ? (patients.find((p) => p.id === activePatientId) ?? null)
        : null,
    [activePatientId, patients],
  );

  return (
    <PageContainer header={{ title: false, breadcrumb: {} }}>
      <Splitter style={{ height: 'calc(100vh - 120px)', minHeight: 500 }}>
        {/* 左栏：患者列表（会话感知排序） */}
        <Splitter.Panel defaultSize={260} min={200} max={360}>
          {dataLoading ? (
            <Flex align="center" justify="center" style={{ height: '100%' }}>
              <Spin />
            </Flex>
          ) : patients.length === 0 ? (
            <Flex align="center" justify="center" style={{ height: '100%' }}>
              <Empty
                description="暂无绑定患者"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Flex>
          ) : (
            <Conversations
              activeKey={activePatientId ?? undefined}
              onActiveChange={handlePatientSelect}
              items={patientItems}
              style={{ height: '100%' }}
            />
          )}
        </Splitter.Panel>

        {/* 右栏：聊天区（含患者信息头部） */}
        <Splitter.Panel>
          <ChatPanel
            conversationId={activeConvId}
            patientInfo={activePatient}
          />
        </Splitter.Panel>
      </Splitter>
    </PageContainer>
  );
};

export default UserChat;
