# 南方医科大学医院系统 (SMU-SYS-Web)

基于 Ant Design Pro 的医院诊断系统前端项目。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.x | 前端框架 |
| Ant Design | 6.x | UI 组件库 |
| Pro Components | 3.x | 高级业务组件 |
| UmiJS Max | 4.x | 企业级前端框架 |
| TypeScript | 5.x | 类型安全 |

## 功能模块

```
├── 用户登录          # 支持管理员/医生双角色登录
├── 用户列表          # 患者用户管理
│   ├── 用户详情      # 个人信息、诊疗记录、随访记录等
│   └── 诊疗流程      # 5步诊疗流程（初诊→AI推荐→结果录入→AI诊断→处方制定）
├── 诊疗列表          # 诊疗记录管理
├── 药物治疗管理
│   ├── 认知疾病类型  # 疾病分类管理
│   └── 药物列表      # 药物信息管理
├── 康复训练管理      # 认知训练项目管理
└── 基础设置
    ├── 诊疗体系      # 量表配置、检验项目
    ├── 转诊医院      # 合作医院管理
    └── 医师列表      # 医师信息管理
```

## 项目结构

```
src/
├── access.ts                 # 权限控制（canAdmin, canDoctor）
├── app.tsx                   # 全局配置、用户状态管理
├── requestErrorConfig.ts     # 请求拦截器、401 处理
├── components/               # 公共组件
│   ├── PrescriptionComponents/   # 处方展示组件
│   └── PrescriptionModals/       # 处方弹窗组件
├── pages/                    # 页面组件
│   ├── user/login/           # 登录页
│   ├── patientUser/          # 患者用户模块
│   ├── drugTreatment/        # 药物治疗模块
│   ├── rehabilitationTraining/   # 康复训练模块
│   └── basicSettings/        # 基础设置模块
├── utils/                    # 工具函数
│   └── upload.ts             # 文件上传工具
└── services/                 # 服务层
    ├── typings.d.ts          # 全局 API 类型（API 命名空间）
    ├── auth/                 # 认证服务
    ├── static/               # 静态资源服务
    └── patient-user/         # 患者用户类型定义
```

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run start:dev
```

访问 http://localhost:8000

### 构建生产版本

```bash
npm run build
```

## 认证流程

系统支持两种角色登录：

| 角色 | 用户名 | 说明 |
|------|--------|------|
| 管理员 | `admin` | 后台管理权限 |
| 医生 | 医生工号 | 诊疗操作权限 |

### 登录流程

```
用户输入 → 用户名 == "admin"?
    ├─ 是 → POST /api/doctor-admin/auth/login (仅密码)
    └─ 否 → POST /api/doctor/auth/login (工号 + 密码)
```

### Token 存储

| Key | 说明 |
|-----|------|
| `access_token` | JWT 认证令牌 |
| `user_role` | 用户角色（admin/doctor） |
| `currentUser` | 用户信息缓存 |

## API 配置

- 开发环境：通过 proxy 代理到 `https://alzheimer.dianchuang.club`
- 生产环境：直接请求 `https://alzheimer.dianchuang.club`

配置文件：`config/proxy.ts`

## 开发规范

### 类型定义

- 全局 API 类型：`src/services/typings.d.ts`
- 领域类型：各服务目录下的 `typings.d.ts`

### 服务层

```typescript
// src/services/auth/index.ts
import { request } from '@umijs/max';

export async function doctorLogin(params: { code: string; password: string }) {
  return request<API.ApiResponse<API.DoctorLoginResult>>(
    '/api/doctor/auth/login',
    { method: 'POST', data: params }
  );
}
```

### 权限控制

```typescript
// src/access.ts
export default function access(initialState) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser?.role === 'admin',
    canDoctor: currentUser?.role === 'doctor',
    isLoggedIn: !!currentUser,
  };
}
```

### 静态资源上传

系统提供统一的静态资源上传能力，支持图片等文件上传到服务器。

| 接口 | 方法 | URL | 认证 |
|-----|-----|-----|-----|
| 获取静态资源 | GET | `/api/system/static/{path}` | 公开 |
| 上传静态资源 | POST | `/api/system/static/upload` | JWT |

**服务层调用：**

```typescript
import { uploadStatic, getStaticUrl } from '@/services/static';

// 上传文件
const res = await uploadStatic({ file, dir: 'avatars' });
console.log(res.data.url); // /api/system/static/uploads/xxx.png

// 获取完整 URL
const url = getStaticUrl('uploads/xxx.png');
```

**Ant Design Upload 组件集成：**

```tsx
import { getUploadProps, getFileUrl } from '@/utils/upload';

<Upload
  {...getUploadProps({ dir: 'drugs', accept: 'image/*' })}
  listType="picture-card"
  fileList={fileList}
  onChange={({ fileList }) => setFileList(fileList)}
/>
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run start:dev` | 启动开发服务器（连接后端 API） |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 代码检查 |
| `npm run lint:fix` | 自动修复 lint 错误 |
| `npm test` | 运行测试 |

## 相关文档

- [Ant Design 6.0](https://ant-design.antgroup.com/components/overview-cn/)
- [Pro Components](https://pro-components.antdigital.dev/components)
- [UmiJS Max](https://umijs.org/docs/max/introduce)
