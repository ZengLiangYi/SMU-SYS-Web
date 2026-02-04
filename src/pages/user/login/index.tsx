import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, useModel } from '@umijs/max';
import { Alert, App, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { adminLogin, doctorLogin } from '@/services/auth';
import Settings from '../../../../config/defaultSettings';

const { Text } = Typography;

const useStyles = createStyles(() => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('/images/bg.png')",
      backgroundSize: '100% 100%',
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<{ status?: string }>({});
  const [loading, setLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  // 遵循 js-early-exit：早返回模式
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    const { username, password } = values;

    setLoading(true);
    try {
      // 根据用户名判断登录类型
      const isAdmin = username === 'admin';

      if (isAdmin) {
        // 管理端登录 - 只需要密码
        const res = await adminLogin({ password });

        // 早返回：登录失败
        if (res.status !== 'OK') {
          setUserLoginState({ status: 'error' });
          message.error(res.msg || '登录失败');
          return;
        }

        // 存储管理员信息（遵循 client-localstorage-schema）
        try {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              name: '管理员',
              avatar: '/images/avatar.png',
              role: 'admin',
            }),
          );
        } catch {
          // localStorage 可能在某些环境下不可用
        }
      } else {
        // 医生登录 - 工号 + 密码
        const res = await doctorLogin({ code: username, password });

        // 早返回：登录失败
        if (res.status !== 'OK') {
          setUserLoginState({ status: 'error' });
          message.error(res.msg || '登录失败');
          return;
        }

        // 存储医生信息
        try {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('user_role', 'doctor');
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              ...res.data.user,
              avatar: '/images/avatar.png',
              role: 'doctor',
            }),
          );
        } catch {
          // localStorage 可能在某些环境下不可用
        }
      }

      message.success('登录成功！');
      await fetchUserInfo();

      // 获取重定向地址
      const urlParams = new URL(window.location.href).searchParams;
      window.location.href = urlParams.get('redirect') || '/';
    } catch (error) {
      console.error(error);
      setUserLoginState({ status: 'error' });
      message.error('登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>登录页{Settings.title && ` - ${Settings.title}`}</title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="医院管理系统"
          subTitle={
            <Text type="secondary" style={{ fontSize: 12 }}>
              管理员请输入 admin，医生请输入工号
            </Text>
          }
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
            submitButtonProps: {
              loading,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(
              values as { username: string; password: string },
            );
          }}
        >
          {status === 'error' && <LoginMessage content="账户或密码错误" />}

          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="请输入用户名（admin 或医生工号）"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
