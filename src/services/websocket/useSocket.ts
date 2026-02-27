import { useEffect, useRef } from 'react';
import { onSocketEvent, offSocketEvent, getSocket } from './index';
import type { SocketEventMap, SocketEventType } from './typings.d';

/**
 * React hook：订阅 WebSocket 事件
 *
 * @param eventType 事件类型（如 'message:new'、'notification:new'）
 * @param handler 事件处理函数
 *
 * @example
 * useSocket('message:new', (payload) => {
 *   const { conversation_id, message } = payload.data;
 *   setMessages(prev => [...prev, message]);
 * });
 */
export function useSocket<T extends SocketEventType>(
  eventType: T,
  handler: (payload: SocketEventMap[T]) => void,
) {
  // 用 ref 持有最新的 handler，避免频繁取消/重新订阅
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.warn(
        `[useSocket] socket 不可用，跳过 "${eventType}" 订阅`,
      );
      return;
    }

    const stableHandler = (payload: SocketEventMap[T]) => {
      handlerRef.current(payload);
    };

    onSocketEvent(eventType, stableHandler);
    return () => {
      offSocketEvent(eventType, stableHandler);
    };
  }, [eventType]);
}
