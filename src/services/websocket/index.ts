import { io, Socket } from 'socket.io-client';
import type { SocketEventMap, SocketEventType } from './typings.d';

const HEARTBEAT_INTERVAL = 30_000; // 30s
const IS_DEV = process.env.NODE_ENV === 'development';
// 开发走 proxy，生产用实际地址
const WS_URL = IS_DEV ? undefined : 'https://alzheimer.dianchuang.club';

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
    // 开发环境代理不支持 WebSocket 升级，仅用 polling；生产直连支持双协议
    transports: IS_DEV ? ['polling'] : ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  });

  // -------- 连接生命周期日志 --------
  socket.on('connect', () => {
    console.log('[WebSocket] 连接成功, id:', socket?.id);
    startHeartbeat();
  });

  socket.on('connect_error', (err) => {
    console.error('[WebSocket] 连接失败:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn('[WebSocket] 断开, 原因:', reason);
    stopHeartbeat();
  });

  // Manager 级事件（重连）
  socket.io.on('reconnect', (attempt: number) => {
    console.log('[WebSocket] 重连成功, 尝试次数:', attempt);
  });

  socket.io.on('reconnect_error', (err: Error) => {
    console.error('[WebSocket] 重连失败:', err.message);
  });

  // 服务端鉴权/系统错误（文档 §5.4）
  socket.on('system:error', (payload: unknown) => {
    console.error('[WebSocket] 服务端错误:', payload);
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
