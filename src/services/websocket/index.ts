import { io, Socket } from 'socket.io-client';
import type { SocketEventMap, SocketEventType } from './typings.d';

const HEARTBEAT_INTERVAL = 30_000; // 30s
// 开发走 proxy，生产用实际地址
const WS_URL =
  process.env.NODE_ENV === 'development'
    ? undefined
    : 'https://alzheimer.dianchuang.club';

let socket: Socket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 获取当前 Socket 实例（可能为 null）
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * 建立 WebSocket 连接（仅医生角色调用）
 */
export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(WS_URL ?? '', {
    path: '/socket.io',
    auth: { token, role: 'doctor' },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  });

  // 连接成功后启动心跳
  socket.on('connect', () => {
    startHeartbeat();
  });

  // 断线时清除心跳
  socket.on('disconnect', () => {
    stopHeartbeat();
  });

  return socket;
}

/**
 * 断开 WebSocket 连接
 */
export function disconnectSocket() {
  stopHeartbeat();
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/**
 * 监听服务端推送事件
 */
export function onSocketEvent<T extends SocketEventType>(
  eventType: T,
  handler: (payload: SocketEventMap[T]) => void,
) {
  if (!socket) return;
  socket.on(eventType, handler as any);
}

/**
 * 移除事件监听
 */
export function offSocketEvent<T extends SocketEventType>(
  eventType: T,
  handler: (payload: SocketEventMap[T]) => void,
) {
  if (!socket) return;
  socket.off(eventType, handler as any);
}

// -------- 心跳 --------

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    socket?.emit('heartbeat');
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}
