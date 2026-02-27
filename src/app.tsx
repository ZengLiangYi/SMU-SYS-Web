import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type {
  RequestConfig,
  RunTimeLayoutConfig,
  RuntimeAntdConfig,
} from '@umijs/max';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import {
  AvatarDropdown,
  AvatarName,
} from '@/components/RightContent/AvatarDropdown';

// dayjs 全局配置（仅在入口执行一次）
// 后端约定所有时间戳均为 UTC+0（RFC 2822 + GMT），无需 utc 插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

import NotificationBell from '@/components/NotificationBell';
import { getDoctorMe } from '@/services/auth';
import { getStaticUrl } from '@/services/static';
import { connectSocket } from '@/services/websocket';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const loginPath = '/user/login';

// 角色对应的默认首页
const roleHomePath = {
  admin: '/basic-settings/doctor-list',
  doctor: '/patient-user',
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async (): Promise<API.CurrentUser | undefined> => {
    try {
      const token = localStorage.getItem('access_token');
      const role = localStorage.getItem('user_role');

      // 早返回：无 token 直接跳转
      if (!token) {
        history.push(loginPath);
        return undefined;
      }

      if (role === 'doctor') {
        // 医生：调用 /me 接口获取最新信息
        const res = await getDoctorMe();
        if (res.status === 'OK') {
          // 建立 WebSocket 连接（医生角色）
          connectSocket(token);
          return {
            ...res.data,
            avatar: res.data.avatar_url
              ? getStaticUrl(res.data.avatar_url)
              : '/images/avatar.png',
            role: 'doctor',
          } as API.CurrentUser;
        }
        // 认证失败，跳转登录
        history.push(loginPath);
        return undefined;
      }

      if (role === 'admin') {
        // 管理员：使用本地存储（无 /me 接口）
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          return JSON.parse(stored) as API.CurrentUser;
        }
      }

      // 认证失败，跳转登录
      history.push(loginPath);
      return undefined;
    } catch {
      history.push(loginPath);
      return undefined;
    }
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: () => [<NotificationBell key="notification" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    onPageChange: () => {
      const { location } = history;
      const { currentUser } = initialState ?? {};

      // 早返回：未登录时重定向到登录页
      if (!currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
        return;
      }

      // 早返回：无用户信息
      if (!currentUser) return;

      const role = currentUser.role as 'admin' | 'doctor';
      const homePath = roleHomePath[role];

      // 根路径重定向到角色首页
      if (location.pathname === '/') {
        history.replace(homePath);
        return;
      }

      // Admin 只能访问医师列表和系统设置
      if (
        role === 'admin' &&
        !location.pathname.startsWith('/basic-settings/doctor-list') &&
        !location.pathname.startsWith('/basic-settings/system-settings')
      ) {
        history.replace(homePath);
        return;
      }

      // Doctor 不能访问医师列表
      if (
        role === 'doctor' &&
        location.pathname.startsWith('/basic-settings/doctor-list')
      ) {
        history.replace(homePath);
      }
    },
    bgLayoutImgList: [],

    menuHeaderRender: undefined,
    childrenRender: (children) => {
      return children;
    },
    ...initialState?.settings,
  };
};

export const antd: RuntimeAntdConfig = (memo) => {
  memo.theme ??= {};
  memo.theme.token ??= {};
  try {
    const stored = localStorage.getItem('systemFontSize');
    if (stored) {
      const size = parseInt(stored, 10);
      if (size >= 12 && size <= 24) {
        memo.theme.token.fontSize = size;
        // 大字体自适应：按比例缩放控件高度，避免文字溢出
        if (size > 14) {
          memo.theme.token.controlHeight = Math.round(32 * (size / 14));
        }
      }
    }
  } catch {
    /* localStorage 可能不可用 */
  }
  return memo;
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // 开发环境用空（走 proxy），生产环境用实际地址
  baseURL:
    process.env.NODE_ENV === 'development'
      ? ''
      : 'https://alzheimer.dianchuang.club',
  ...errorConfig,
};
