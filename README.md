# 南方医科大学医院系统 (SMU-SYS-Web)

基于 Ant Design Pro 的医院诊断系统前端项目。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.x | 前端框架 |
| Ant Design | 6.x | UI 组件库 |
| Ant Design X | 2.x | AI/聊天 UI 组件（Conversations、Bubble、Sender、Attachments） |
| Pro Components | 3.x | 高级业务组件 |
| UmiJS Max | 4.x | 企业级前端框架 |
| TypeScript | 5.x | 类型安全 |
| Socket.IO Client | 4.x | WebSocket 实时通信 |

## 功能模块

```
├── 用户登录          # 支持管理员/医生双角色登录
├── 用户列表          # 患者用户管理（含聊天入口）
│   ├── 用户详情      # 个人信息、诊疗记录、随访记录等
│   └── 诊疗流程      # 5步诊疗流程（初诊→AI推荐→结果录入→AI诊断→处方制定）
├── 用户聊天          # 医患实时聊天（三栏布局：会话列表 + 聊天区 + 患者详情）
│   ├── 文本/图片消息  # 支持文字发送、图片上传与粘贴
│   ├── 消息撤回      # 医生可撤回已发送消息
│   └── WebSocket     # Socket.IO 实时推送 + 心跳保活
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
│   │   ├── UserList/         # 用户列表（含聊天入口）
│   │   ├── UserChat/         # 聊天页面（Splitter 双栏布局：患者列表 + 聊天区）
│   │   │   └── components/   # ChatPanel
│   │   ├── UserDetail/       # 用户详情
│   │   └── Diagnosis/        # 诊疗流程
│   ├── drugTreatment/        # 药物治疗模块
│   ├── rehabilitationTraining/   # 康复训练模块
│   └── basicSettings/        # 基础设置模块
├── utils/                    # 工具函数
│   ├── constants.ts          # 常量定义（枚举值等）
│   ├── date.ts               # 日期格式化工具
│   └── upload.ts             # 文件上传工具
└── services/                 # 服务层
    ├── typings.d.ts          # 全局 API 类型（API 命名空间）
    ├── auth/                 # 认证服务
    ├── chat/                 # 聊天服务（会话、消息、媒体上传）
    ├── websocket/            # WebSocket 服务（Socket.IO 连接、心跳、事件订阅）
    ├── static/               # 静态资源服务
    ├── rehab-level/          # 康复训练关卡服务
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

- 开发环境：通过 proxy 代理到 `https://alzheimer.dianchuang.club`（`/api/` + `/socket.io`）
- 生产环境：直接请求 `https://alzheimer.dianchuang.club`
- WebSocket：Socket.IO 连接路径 `/socket.io`，开发环境走代理，生产环境走显式 URL

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

### 列表模块开发规范

以 `TrainingList` 为参考，列表模块应遵循以下规范：

#### 目录结构

```
src/pages/moduleName/ListPage/
├── index.tsx                    # 列表主页面
└── components/
    ├── CreateXxxForm.tsx        # 新建表单（ModalForm）
    ├── EditXxxForm.tsx          # 编辑表单（trigger 模式）
    └── DetailModal.tsx          # 详情弹窗
```

**注意**：不使用 `components/index.ts` barrel 文件，直接导入具体组件文件。

#### 服务层

```
src/services/module-name/
├── index.ts                     # API 函数
└── typings.d.ts                 # 类型定义（使用 interface）
```

**类型定义示例：**

```typescript
// src/services/rehab-level/typings.d.ts
export interface RehabLevel {
  id: string;
  level_type: string;
  name: string;
  // ... 其他字段使用 snake_case（与 API 一致）
}

export interface RehabLevelListParams {
  offset?: number;
  limit?: number;
  // ... 筛选参数
}
```

**API 函数示例：**

```typescript
// src/services/rehab-level/index.ts
import { request } from '@umijs/max';
import type { RehabLevel, RehabLevelListParams } from './typings.d';

export async function getRehabLevels(params: RehabLevelListParams) {
  return request<API.ApiResponse<RehabLevelListResult>>(
    '/api/doctor/rehab-levels',
    { method: 'GET', params },
  );
}
```

#### 列表页面

```typescript
// index.tsx
import { App, Button, Image, Popconfirm, Space } from 'antd';
import { useRequest } from '@umijs/max';
import { REHAB_LEVEL_TYPE_ENUM } from '@/utils/constants';
import { formatDateTime } from '@/utils/date';
import { getStaticUrl } from '@/services/static';
import CreateXxxForm from './components/CreateXxxForm';  // 直接导入
import EditXxxForm from './components/EditXxxForm';

const ListPage: React.FC = () => {
  const { message } = App.useApp();  // 使用 App.useApp() 获取 message
  const actionRef = useRef<ActionType>(null);

  // 删除使用 useRequest（manual 模式）
  const { run: runDelete } = useRequest(deleteApi, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
  });

  const columns: ProColumns[] = [
    {
      title: '类型',
      dataIndex: 'level_type',         // 使用 API 字段名（snake_case）
      valueEnum: REHAB_LEVEL_TYPE_ENUM, // 枚举值从 constants 导入
      fieldProps: { placeholder: '请选择类型…' },  // placeholder 用 …
    },
    {
      title: '图片',
      dataIndex: 'image_url',
      render: (_, record) => (
        <Image
          src={getStaticUrl(record.image_url)}
          width={60}
          height={60}  // 必须指定 width/height 防止 CLS
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (_, record) => formatDateTime(record.created_at),
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <EditXxxForm trigger={<Button>编辑</Button>} record={record} />
          <Popconfirm onConfirm={() => runDelete(record.id)}>
            <Button danger aria-label="删除">删除</Button>  {/* aria-label */}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      toolBarRender={() => [
        <CreateXxxForm key="create" onOk={() => actionRef.current?.reload()} />,
      ]}
      request={async (params) => {
        const { current = 1, pageSize = 10 } = params;
        try {
          const { data } = await getList({
            offset: (current - 1) * pageSize,
            limit: pageSize,
          });
          return { data: data.items, total: data.total, success: true };
        } catch {
          return { data: [], total: 0, success: false };
        }
      }}
    />
  );
};
```

#### 表单弹窗

**新建表单（CreateXxxForm）：**

```typescript
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Button } from 'antd';

const CreateXxxForm: FC<{ onOk?: () => void }> = ({ onOk }) => {
  const { message } = App.useApp();
  const { run, loading } = useRequest(createApi, {
    manual: true,
    onSuccess: () => { message.success('创建成功'); onOk?.(); },
    onError: () => { message.error('创建失败，请重试'); },
  });

  return (
    <ModalForm
      title="添加"
      trigger={<Button type="primary">添加</Button>}
      modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
      onFinish={async (values) => {
        try {
          await run(values);
          return true;  // 成功时关闭弹窗
        } catch {
          return false; // 失败时保持弹窗打开，让用户可以重试
        }
      }}
    >
      <ProFormSelect options={OPTIONS_FROM_CONSTANTS} />
    </ModalForm>
  );
};
```

**编辑表单（EditXxxForm）- trigger 模式：**

```typescript
import { cloneElement, useState, useCallback } from 'react';

const EditXxxForm: FC<{ trigger: ReactElement; record: Item; onOk?: () => void }> = ({
  trigger, record, onOk,
}) => {
  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);
  const onCancel = useCallback(() => setOpen(false), []);

  return (
    <>
      {cloneElement(trigger, { onClick: onOpen })}
      <ModalForm
        open={open}
        onOpenChange={(v) => !v && onCancel()}
        initialValues={record}
        modalProps={{ destroyOnClose: true }}
      >
        {/* 表单字段 */}
      </ModalForm>
    </>
  );
};
```

#### 工具函数

| 工具 | 路径 | 用途 |
|------|------|------|
| `REHAB_LEVEL_TYPES` | `@/utils/constants` | 枚举选项（ProFormSelect） |
| `REHAB_LEVEL_TYPE_ENUM` | `@/utils/constants` | valueEnum（ProTable） |
| `formatDateTime` | `@/utils/date` | 日期格式化（UTC） |
| `getStaticUrl` | `@/services/static` | 静态资源 URL |
| `getUploadProps` | `@/utils/upload` | Upload 组件配置 |
| `getFileUrl` | `@/utils/upload` | 提取上传响应 URL |
| `urlToUploadFile` | `@/utils/upload` | URL 转 UploadFile（回显） |

#### 规范要点

| 规范 | 说明 |
|------|------|
| 消息提示 | 使用 `App.useApp()` 获取 message |
| API 调用 | 使用 `useRequest` hook（manual 模式） |
| 表单弹窗 | 使用 `ModalForm` + `ProFormXxx` 组件 |
| 删除确认 | 使用 `Popconfirm` 组件 |
| 编辑触发 | 使用 trigger 模式 + `cloneElement` |
| 字段命名 | 直接使用 API 字段名（snake_case） |
| 枚举值 | 统一维护在 `@/utils/constants` |
| 图片显示 | 指定 width/height 防止 CLS |
| 图标按钮 | 添加 `aria-label` 提升可访问性 |
| placeholder | 使用 `…` 结尾（Typography 规范） |
| 日期格式化 | 使用 `formatDateTime`（保持 UTC） |
| 组件导入 | 直接导入文件，不用 barrel |
| 错误处理 | `onFinish` 中用 try-catch，失败返回 `false` 保持弹窗 |

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
- [Ant Design X 2.0](https://x.ant.design/components/overview-cn)
- [Pro Components](https://pro-components.antdigital.dev/components)
- [UmiJS Max](https://umijs.org/docs/max/introduce)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
