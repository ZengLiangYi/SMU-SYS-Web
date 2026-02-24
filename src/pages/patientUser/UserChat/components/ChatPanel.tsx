import {
  EyeOutlined,
  PaperClipOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Attachments, Bubble, Sender } from '@ant-design/x';
import { history, useModel, useRequest } from '@umijs/max';
import {
  App,
  Avatar,
  Button,
  Divider,
  Empty,
  Flex,
  Image,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  getMessages,
  markConversationRead,
  recallMessage,
  sendMessage,
  uploadChatMedia,
} from '@/services/chat';
import type { MessageListItem } from '@/services/chat/typings.d';
import type { PatientListItem } from '@/services/patient-user/typings.d';
import { getStaticUrl } from '@/services/static';
import { useSocket } from '@/services/websocket/useSocket';
import { getCategoryColor } from '@/utils/constants';
import { isWithinMinutesUTC } from '@/utils/date';

const { Link, Text } = Typography;

// 撤回消息时间限制（分钟）
const RECALL_LIMIT_MINUTES = 2;

interface ChatPanelProps {
  conversationId: string | null;
  patientInfo: PatientListItem | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  conversationId,
  patientInfo,
}) => {
  const { message: antMessage } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDoctorId = initialState?.currentUser?.id;

  const [messages, setMessages] = useState<MessageListItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [attachOpen, setAttachOpen] = useState(false);
  const [recallTick, setRecallTick] = useState(0);
  const attachRef = useRef<any>(null);
  const bubbleListRef = useRef<any>(null);

  // -------- 消息列表 --------
  const { loading: msgsLoading } = useRequest(
    () =>
      conversationId
        ? getMessages(conversationId, { limit: 100 })
        : Promise.reject(),
    {
      refreshDeps: [conversationId],
      ready: !!conversationId,
      onSuccess: (data) => {
        // API 返回最新在前，Bubble.List 需要最旧在前
        setMessages([...(data?.items ?? [])].reverse());
      },
    },
  );

  // -------- 发送文本消息 --------
  const handleSend = useCallback(
    (content: string) => {
      if (!conversationId || !content.trim()) return;
      startTransition(async () => {
        try {
          const { data } = await sendMessage(conversationId, {
            msg_type: 'text',
            content: content.trim(),
          });
          setMessages((prev) => [...prev, data]);
          setInputValue('');
        } catch {
          antMessage.error('发送失败，请重试');
          // 发送失败不清空输入框
        }
      });
    },
    [conversationId, antMessage],
  );

  // -------- 上传图片并发送 --------
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!conversationId) return;
      try {
        const uploadRes = await uploadChatMedia(file, 'image');
        const { data } = await sendMessage(conversationId, {
          msg_type: 'image',
          media_asset_id: uploadRes.data.id,
          media_url: uploadRes.data.url,
        });
        setMessages((prev) => [...prev, data]);
        setAttachOpen(false);
      } catch {
        antMessage.error('图片发送失败');
      }
    },
    [conversationId, antMessage],
  );

  // -------- 粘贴文件 --------
  const handlePasteFile = useCallback(
    (files: FileList) => {
      const file = files[0];
      if (file?.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    },
    [handleImageUpload],
  );

  // -------- 撤回消息：定时更新按钮状态 --------
  useEffect(() => {
    const timer = setInterval(() => {
      setRecallTick((prev) => prev + 1);
    }, 10_000); // 每 10 秒更新一次，确保撤回按钮及时消失
    return () => clearInterval(timer);
  }, []);

  const handleRecall = useCallback(
    async (messageId: string, createdAt: string | null) => {
      if (!isWithinMinutesUTC(createdAt, RECALL_LIMIT_MINUTES)) {
        antMessage.warning('已超过撤回时限');
        return;
      }
      try {
        await recallMessage(messageId);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  status: 'recalled' as const,
                  recalled_at: new Date().toISOString(),
                }
              : m,
          ),
        );
      } catch (err: any) {
        const status = err?.response?.status ?? err?.data?.status;
        antMessage.error(
          status === 410 || status === 'ERR.EXPIRED'
            ? '已超过撤回时限'
            : '撤回失败',
        );
      }
    },
    [antMessage],
  );

  // -------- WebSocket 实时消息 --------
  useSocket('message:new', (payload) => {
    const { conversation_id, message: newMsg } = payload.data;
    if (conversation_id === conversationId) {
      setMessages((prev) => [...prev, newMsg]);
      // 当前会话收到新消息自动标记已读
      markConversationRead(conversation_id).catch(() => {});
    }
  });

  // -------- 气泡数据映射 --------
  const bubbleItems = useMemo(
    () =>
      messages.map((msg) => {
        if (msg.status === 'recalled') {
          return {
            key: msg.id,
            role: 'system' as const,
            content: '消息已撤回',
          };
        }

        const isDoctor = msg.sender_role === 'doctor';
        const isOwnMessage = msg.sender_id === currentDoctorId;
        const canRecall = isWithinMinutesUTC(
          msg.created_at,
          RECALL_LIMIT_MINUTES,
        );

        // 媒体内容渲染
        let content: React.ReactNode = msg.content ?? '';
        if (msg.msg_type === 'image' && msg.media_url) {
          content = (
            <Image
              src={getStaticUrl(msg.media_url)}
              width={200}
              style={{ borderRadius: 8 }}
            />
          );
        } else if (msg.msg_type === 'audio' && msg.media_url) {
          content = (
            // biome-ignore lint/a11y/useMediaCaption: chat audio
            <audio src={getStaticUrl(msg.media_url)} controls />
          );
        } else if (msg.msg_type === 'video' && msg.media_url) {
          content = (
            // biome-ignore lint/a11y/useMediaCaption: chat video
            <video
              src={getStaticUrl(msg.media_url)}
              controls
              width={280}
              style={{ borderRadius: 8 }}
            />
          );
        }

        return {
          key: msg.id,
          role: isDoctor ? ('doctor' as const) : ('patient' as const),
          content,
          footer:
            isOwnMessage && msg.status === 'sent' && canRecall ? (
              <Link
                type="secondary"
                style={{ fontSize: 12 }}
                onClick={() => handleRecall(msg.id, msg.created_at)}
              >
                撤回
              </Link>
            ) : null,
        };
      }),
    [messages, currentDoctorId, handleRecall, recallTick],
  );

  // -------- 角色配置 --------
  const roleConfig = useMemo(
    () => ({
      doctor: {
        placement: 'end' as const,
        variant: 'filled' as const,
        avatar: <Avatar icon={<UserOutlined />} />,
      },
      patient: {
        placement: 'start' as const,
        variant: 'outlined' as const,
        avatar: <Avatar icon={<UserOutlined />} />,
      },
      system: {},
    }),
    [],
  );

  if (!conversationId) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%' }}>
        <Empty
          description="请从左侧选择一位患者开始聊天"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ height: '100%' }}>
      {/* 患者信息头部 */}
      {patientInfo ? (
        <>
          <Flex align="center" gap={12} style={{ padding: '12px 16px' }}>
            <Avatar icon={<UserOutlined />} />
            <Flex vertical gap={2} style={{ flex: 1 }}>
              <Flex align="center" gap={8}>
                <Text strong>{patientInfo.name}</Text>
                <Text type="secondary">
                  {patientInfo.gender}{' '}
                  {patientInfo.age != null ? `${patientInfo.age}岁` : ''}
                </Text>
              </Flex>
              {patientInfo.categories?.length > 0 ? (
                <Flex gap={4} wrap>
                  {patientInfo.categories.map((cat) => (
                    <Tag
                      key={cat}
                      color={getCategoryColor(cat)}
                      style={{ borderRadius: 12, margin: 0 }}
                    >
                      {cat}
                    </Tag>
                  ))}
                </Flex>
              ) : null}
            </Flex>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() =>
                history.push(`/patient-user/detail/${patientInfo.id}`)
              }
            >
              查看详情
            </Button>
          </Flex>
          <Divider style={{ margin: 0 }} />
        </>
      ) : null}

      {/* 消息列表 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {msgsLoading ? (
          <Flex align="center" justify="center" style={{ height: '100%' }}>
            <Spin />
          </Flex>
        ) : (
          <Bubble.List
            ref={bubbleListRef}
            autoScroll
            role={roleConfig}
            items={bubbleItems}
            style={{ height: '100%' }}
          />
        )}
      </div>

      {/* 输入区域 */}
      <Sender
        placeholder="输入消息…"
        submitType="shiftEnter"
        loading={isPending}
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSend}
        onPasteFile={handlePasteFile}
        header={
          <Sender.Header
            title="发送图片"
            open={attachOpen}
            onOpenChange={setAttachOpen}
          >
            <Attachments
              ref={attachRef}
              accept="image/*"
              maxCount={1}
              beforeUpload={(file) => {
                handleImageUpload(file as File);
                return false; // 阻止默认上传
              }}
              placeholder={{
                title: '点击或拖拽图片到此处',
                description: '支持 JPG、PNG、GIF 格式',
              }}
            />
          </Sender.Header>
        }
        prefix={
          <Button
            type="text"
            icon={<PaperClipOutlined />}
            onClick={() => setAttachOpen((prev) => !prev)}
            aria-label="上传图片"
          />
        }
      />
    </Flex>
  );
};

export default ChatPanel;
