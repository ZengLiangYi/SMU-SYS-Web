/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    // 管理员权限
    canAdmin: currentUser?.role === 'admin',
    // 医生权限
    canDoctor: currentUser?.role === 'doctor',
    // 是否已登录
    isLoggedIn: !!currentUser,
  };
}
