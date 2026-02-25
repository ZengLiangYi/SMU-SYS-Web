import { UserOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useModel, useRequest } from '@umijs/max';
import type { UploadFile } from 'antd';
import {
  App,
  Avatar,
  Button,
  Col,
  Divider,
  Row,
  Space,
  Tag,
  Typography,
  Upload,
} from 'antd';
import React, { useMemo, useState } from 'react';
import {
  changeDoctorPassword,
  getDoctorMe,
  logout,
  updateDoctorMe,
} from '@/services/auth';
import { getStaticUrl } from '@/services/static';
import { disconnectSocket } from '@/services/websocket';
import { getFileUrl, getUploadProps, urlToUploadFile } from '@/utils/upload';

const { Text, Title } = Typography;

const Center: React.FC = () => {
  const { message } = App.useApp();
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  // 获取最新用户信息（useRequest 自动解包 ApiResponse）
  const {
    data: userData,
    loading: userLoading,
    mutate: mutateUser,
  } = useRequest(getDoctorMe);

  // 合并最新 API 数据和全局 currentUser（currentUser 含 avatar/role）
  const userInfo = userData ? { ...currentUser, ...userData } : currentUser;

  // 头像上传状态
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>(() => {
    if (currentUser?.avatar) {
      return [urlToUploadFile(currentUser.avatar)];
    }
    return [];
  });

  // 更新个人资料
  const { run: runUpdate, loading: updateLoading } = useRequest(
    updateDoctorMe,
    {
      manual: true,
      onSuccess: (res: API.DoctorUser) => {
        message.success('个人信息更新成功');
        // 从最新上传的头像获取 URL
        const newAvatarUrl =
          avatarFileList.length > 0
            ? getStaticUrl(getFileUrl(avatarFileList[0]))
            : undefined;
        // 刷新全局用户状态（rerender-functional-setstate）
        setInitialState((s) => ({
          ...s,
          currentUser: {
            ...s?.currentUser,
            ...res,
            avatar: newAvatarUrl ?? s?.currentUser?.avatar,
            role: s?.currentUser?.role ?? 'doctor',
          } as API.CurrentUser,
        }));
        // 直接更新本地 userData，左侧资料卡立即同步，无 loading 闪烁
        mutateUser(res);
        // 同步 localStorage（页面刷新时 fetchUserInfo 读取 avatar）
        try {
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              ...res,
              avatar: newAvatarUrl ?? currentUser?.avatar,
              role: currentUser?.role ?? 'doctor',
            }),
          );
        } catch {
          // ignore
        }
      },
      onError: () => {
        message.error('更新失败，请重试');
      },
    },
  );

  // 修改密码
  const { run: runChangePassword, loading: passwordLoading } = useRequest(
    changeDoctorPassword,
    {
      manual: true,
      onSuccess: async () => {
        message.success('密码修改成功，请重新登录');
        // 登出
        disconnectSocket();
        try {
          await logout();
        } catch {
          // ignore
        }
        try {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_role');
          localStorage.removeItem('currentUser');
        } catch {
          // ignore
        }
        history.replace('/user/login');
      },
      onError: () => {
        message.error('密码修改失败，请重试');
      },
    },
  );

  // 头像 URL（取最新上传的或已有的）
  const avatarUrl = useMemo(() => {
    if (avatarFileList.length > 0) {
      const file = avatarFileList[0];
      if (file.response?.data?.url) {
        return getStaticUrl(file.response.data.url);
      }
      return file.url || file.thumbUrl || '';
    }
    return currentUser?.avatar ? getStaticUrl(currentUser.avatar) : '';
  }, [avatarFileList, currentUser?.avatar]);

  const roleLabel = currentUser?.role === 'admin' ? '管理员' : '医生';
  const roleColor = currentUser?.role === 'admin' ? 'red' : 'blue';

  return (
    <PageContainer>
      <Row gutter={24}>
        {/* 左侧资料卡 */}
        <Col xs={24} md={8}>
          <ProCard style={{ textAlign: 'center' }} loading={userLoading}>
            <Space
              orientation="vertical"
              size="middle"
              style={{ width: '100%' }}
            >
              <Avatar
                size={104}
                icon={<UserOutlined />}
                src={avatarUrl || undefined}
              />
              <Title level={4} style={{ marginBottom: 0 }}>
                {userInfo?.name ?? '--'}
              </Title>
              <Text type="secondary">工号：{userInfo?.code ?? '--'}</Text>
              <Text type="secondary">手机号：{userInfo?.phone ?? '--'}</Text>
              <Tag color={roleColor}>{roleLabel}</Tag>
              <Divider />
              <ModalForm
                title="修改密码"
                trigger={<Button type="link">修改密码</Button>}
                width={400}
                modalProps={{
                  destroyOnHidden: true,
                  okButtonProps: { loading: passwordLoading },
                }}
                onFinish={async (values: {
                  old_password: string;
                  new_password: string;
                  confirm_password: string;
                }) => {
                  await runChangePassword({
                    old_password: values.old_password,
                    new_password: values.new_password,
                  });
                  return true;
                }}
              >
                <ProFormText.Password
                  name="old_password"
                  label="旧密码"
                  placeholder="请输入旧密码…"
                  fieldProps={{ autoComplete: 'current-password' }}
                  rules={[{ required: true, message: '请输入旧密码' }]}
                />
                <ProFormText.Password
                  name="new_password"
                  label="新密码"
                  placeholder="请输入新密码…"
                  fieldProps={{ autoComplete: 'new-password' }}
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 6, message: '密码至少6个字符' },
                    { max: 128, message: '密码最多128个字符' },
                  ]}
                />
                <ProFormText.Password
                  name="confirm_password"
                  label="确认新密码"
                  placeholder="请再次输入新密码…"
                  fieldProps={{ autoComplete: 'new-password' }}
                  dependencies={['new_password']}
                  rules={[
                    { required: true, message: '请确认新密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('new_password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次密码输入不一致'));
                      },
                    }),
                  ]}
                />
              </ModalForm>
            </Space>
          </ProCard>
        </Col>

        {/* 右侧编辑表单 */}
        <Col xs={24} md={16}>
          <ProCard title="基本信息" loading={userLoading}>
            <ProForm
              initialValues={{
                name: userInfo?.name,
                phone: userInfo?.phone,
              }}
              submitter={{
                submitButtonProps: { loading: updateLoading },
                resetButtonProps: false,
              }}
              onFinish={async (values) => {
                const avatarUrlFromUpload =
                  avatarFileList.length > 0
                    ? getFileUrl(avatarFileList[0])
                    : undefined;
                await runUpdate({
                  ...values,
                  avatar_url: avatarUrlFromUpload,
                });
                return true;
              }}
            >
              <ProFormText
                name="name"
                label="姓名"
                placeholder="请输入姓名…"
                rules={[
                  { required: true, message: '请输入姓名' },
                  { max: 128, message: '姓名最多128个字符' },
                ]}
              />
              <ProFormText
                name="phone"
                label="手机号"
                placeholder="请输入手机号…"
                fieldProps={{ inputMode: 'tel' }}
                rules={[{ max: 20, message: '手机号最多20个字符' }]}
              />
              <ProForm.Item label="头像" name="avatar_upload">
                <Upload
                  {...getUploadProps({
                    dir: 'avatars',
                    accept: 'image/*',
                    maxCount: 1,
                  })}
                  listType="picture-card"
                  fileList={avatarFileList}
                  onChange={({ fileList }) => setAvatarFileList(fileList)}
                >
                  {avatarFileList.length >= 1 ? null : (
                    <div>
                      <UserOutlined />
                      <div style={{ marginTop: 8 }}>上传头像</div>
                    </div>
                  )}
                </Upload>
              </ProForm.Item>
            </ProForm>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Center;
