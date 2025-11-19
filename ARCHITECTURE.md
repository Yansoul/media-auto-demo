# AI 自媒体选题助手 - 架构文档

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [架构设计](#架构设计)
- [目录结构](#目录结构)
- [核心模块](#核心模块)
- [数据流](#数据流)
- [最佳实践](#最佳实践)

---

## 项目概述

AI 自媒体选题助手是一个智能化的选题推荐系统，帮助自媒体创作者根据行业和赛道选择，获取 AI 生成的优质选题建议。

### 核心功能

1. **多步骤向导流程**
   - 第1步：选择行业领域
   - 第2步：选择细分赛道
   - 第3步：输入历史文案（可选）
   - 第4步：生成选题建议

2. **智能缓存机制**
   - 自动保存用户偏好
   - 支持快速恢复上次配置

3. **实时轮询系统**
   - 异步任务提交
   - 实时获取生成结果
   - 支持增量更新

---

## 技术栈

### 前端框架

- **Next.js 15** - React 框架，支持 SSR/SSG
- **React 19** - UI 库
- **TypeScript 5** - 类型安全

### UI 组件

- **HeroUI 2.8** - UI 组件库
- **Framer Motion 12** - 动画库
- **Tailwind CSS 4** - 样式框架

### 状态管理

- **React Context API** - 全局状态管理
- **Custom Hooks** - 业务逻辑封装

### 数据请求

- **Fetch API** - HTTP 请求
- **自定义 API 客户端** - 统一请求封装

### 代码质量

- **ESLint** - 代码规范
- **TypeScript** - 类型检查

---

## 架构设计

### 分层架构

```
┌─────────────────────────────────────────┐
│          Presentation Layer              │
│  (Components, Pages, UI)                │
├─────────────────────────────────────────┤
│         Application Layer                │
│  (Context, Hooks, Business Logic)       │
├─────────────────────────────────────────┤
│          Service Layer                   │
│  (API Services, External Integrations)  │
├─────────────────────────────────────────┤
│           Utility Layer                  │
│  (Logger, Errors, Constants, Helpers)   │
└─────────────────────────────────────────┘
```

### 核心设计原则

1. **单一职责原则 (SRP)**
   - 每个组件/模块只负责一个功能
   - 文件行数控制在 150 行以内

2. **关注点分离 (SoC)**
   - UI 与业务逻辑分离
   - 数据获取与状态管理分离

3. **依赖倒置 (DIP)**
   - 高层模块不依赖低层模块
   - 通过接口和抽象进行通信

4. **开闭原则 (OCP)**
   - 对扩展开放，对修改封闭
   - 通过配置和插件机制扩展功能

---

## 目录结构

```
app/
├── page.tsx                          # 主页面（19 行）
├── layout.tsx                        # 根布局
├── providers.tsx                     # Provider 配置
│
├── (features)/                       # 功能模块
│   └── topic-wizard/                 # 选题向导功能
│       ├── TopicWizardContainer.tsx  # 主容器
│       ├── context/                  # 状态管理
│       │   ├── WizardContext.tsx
│       │   └── WizardProvider.tsx
│       └── components/               # 向导组件
│           ├── WizardStepper.tsx     # 步骤指示器
│           ├── PollingStatus.tsx     # 轮询状态
│           ├── steps/                # 步骤组件
│           │   ├── IndustrySelectStep.tsx
│           │   ├── NicheSelectStep.tsx
│           │   ├── ContentScriptsStep.tsx
│           │   └── SummaryStep.tsx
│           └── TopicResults/         # 结果展示
│               ├── TopicResultsList.tsx
│               ├── TopicResultCard.tsx
│               ├── ResultScoreBadge.tsx
│               └── ResultAnalysis.tsx
│
├── components/                       # 通用组件
│   ├── common/                       # 基础组件
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorAlert.tsx
│   ├── CachedPreferencesCard.tsx
│   └── ClarityAnalytics.tsx
│
├── hooks/                            # 通用 Hooks
│   ├── useBeforeUnload.ts
│   ├── useDebouncedEffect.ts
│   ├── useFeishuPolling.ts
│   └── useUserPreferences.ts
│
├── services/                         # 服务层
│   ├── api/                          # API 客户端
│   │   ├── client.ts                 # 统一请求封装
│   │   ├── categories.api.ts         # 分类 API
│   │   ├── webhook.api.ts            # Webhook API
│   │   └── retry.ts                  # 重试机制
│   └── feishu/                       # 飞书服务
│       ├── auth.service.ts           # 认证服务
│       ├── task.service.ts           # 任务状态
│       └── topic.service.ts          # 选题结果
│
├── lib/                              # 工具库
│   ├── env.ts                        # 环境变量验证
│   ├── logger.ts                     # 日志工具
│   ├── errors.ts                     # 错误处理
│   └── constants.ts                  # 全局常量
│
├── types/                            # 类型定义
│   ├── api.types.ts                  # API 类型
│   ├── wizard.types.ts               # 向导类型
│   ├── preferences.ts                # 偏好类型
│   └── topic.ts                      # 选题类型
│
└── api/                              # API 路由
    ├── categories/route.ts
    ├── webhook/route.ts
    └── feishu/
        ├── task-status/route.ts
        └── topic-results/route.ts
```

---

## 核心模块

### 1. 向导系统 (Wizard System)

**职责**: 管理多步骤表单流程

**核心文件**:
- `WizardProvider.tsx` - 状态管理
- `WizardContext.tsx` - Context 定义
- `TopicWizardContainer.tsx` - 主容器

**状态管理**:
```typescript
interface WizardState {
  currentStep: WizardStep;
  industries: Industry[];
  niches: Niche[];
  selectedIndustry: string;
  selectedNiche: string;
  contentScripts: string[];
  // ... 更多状态
}
```

### 2. API 客户端 (API Client)

**职责**: 统一的 HTTP 请求处理

**特性**:
- 自动重试机制
- 请求/响应拦截
- 错误处理
- 超时控制

**使用示例**:
```typescript
import { apiClient } from '@/app/services/api/client';

const data = await apiClient.get('/api/categories');
```

### 3. 轮询系统 (Polling System)

**职责**: 管理异步任务轮询

**核心文件**:
- `useFeishuPolling.ts` - 轮询 Hook

**特性**:
- 自动轮询
- 增量更新
- 超时控制
- 状态追踪

### 4. 错误处理 (Error Handling)

**职责**: 统一的错误处理和用户提示

**核心文件**:
- `errors.ts` - 错误类定义
- `ErrorBoundary.tsx` - 错误边界
- `ErrorAlert.tsx` - 错误提示

**错误层级**:
```
AppError (基类)
  ├── ApiError (API 错误)
  ├── NetworkError (网络错误)
  ├── TimeoutError (超时错误)
  ├── ValidationError (验证错误)
  └── BusinessError (业务错误)
```

### 5. 日志系统 (Logging System)

**职责**: 结构化日志记录

**核心文件**:
- `logger.ts` - 日志工具

**日志级别**:
- DEBUG - 调试信息（仅开发环境）
- INFO - 一般信息
- WARN - 警告信息
- ERROR - 错误信息

**使用示例**:
```typescript
import { logger } from '@/app/lib/logger';

logger.info('用户提交选题任务', { jobId });
logger.error('API 请求失败', error, { endpoint });
```

---

## 数据流

### 1. 页面加载流程

```
用户访问 → page.tsx → TopicWizardContainer
  ↓
WizardProvider 初始化
  ↓
fetchCategories() 获取分类数据
  ↓
渲染第 1 步（行业选择）
```

### 2. 选题生成流程

```
用户点击"获取选题建议"
  ↓
submitTopicGenerationTask() 提交任务
  ↓
获取 jobId
  ↓
startPolling(jobId) 开始轮询
  ↓
每 5 秒查询一次状态和结果
  ↓
增量更新结果到 UI
  ↓
任务完成，停止轮询
```

### 3. 缓存恢复流程

```
页面加载 → loadPreferences()
  ↓
有缓存？
  ├─ 是 → 显示缓存提示卡片
  │        ↓
  │     用户点击"继续使用"
  │        ↓
  │     恢复所有数据
  │        ↓
  │     跳转到第 3 步
  │
  └─ 否 → 正常流程
```

---

## 最佳实践

### 1. 组件开发

✅ **推荐做法**:
```typescript
// 使用 memo 优化性能
export const MyComponent = memo(function MyComponent({ data }: Props) {
  // 使用 useMemo 缓存计算结果
  const processedData = useMemo(() => {
    return heavyComputation(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

❌ **避免**:
```typescript
// 不要在组件内定义组件
function MyComponent() {
  function NestedComponent() { // ❌ 每次渲染都会重新创建
    return <div>...</div>;
  }
  return <NestedComponent />;
}
```

### 2. 状态管理

✅ **推荐做法**:
```typescript
// 使用 Context 避免 props drilling
const { state, actions } = useWizardContext();
```

❌ **避免**:
```typescript
// 不要过度使用 props 传递
<Component1 
  data={data}
  onUpdate={onUpdate}
  loading={loading}
  error={error}
  // ... 10+ props
/>
```

### 3. 错误处理

✅ **推荐做法**:
```typescript
try {
  const data = await apiClient.get('/endpoint');
  return data;
} catch (error) {
  logger.error('操作失败', error, { context });
  throw normalizeError(error);
}
```

❌ **避免**:
```typescript
// 不要吞掉错误
try {
  await riskyOperation();
} catch (e) {
  console.log(e); // ❌ 不够
}
```

### 4. 类型安全

✅ **推荐做法**:
```typescript
// 定义清晰的接口
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

❌ **避免**:
```typescript
// 不要使用 any
function processData(data: any) { // ❌
  return data.something;
}
```

---

## 性能优化

### 1. 代码分割

- 使用 `dynamic` 进行动态导入
- 避免首屏加载过大的 bundle

### 2. 组件优化

- 使用 `React.memo` 防止不必要的重渲染
- 使用 `useMemo` 和 `useCallback` 缓存值和函数

### 3. 请求优化

- 实现请求重试机制
- 添加请求超时控制
- 使用 SWR 或 React Query（可选）

### 4. 缓存策略

- API 响应缓存（24 小时）
- 用户偏好本地缓存
- 飞书 Token 缓存

---

## 安全性

### 1. 环境变量

所有敏感信息存储在环境变量中：
```
FEISHU_ACCESS_KEY_ID
FEISHU_SECRET_ACCESS_KEY
TIKUB_API_KEY
```

### 2. API 安全

- 所有 API 请求通过服务端代理
- 不在客户端暴露敏感信息

### 3. 输入验证

- 表单字段长度限制
- XSS 防护（React 自动转义）

---

## 维护指南

### 添加新功能

1. 在 `app/(features)/` 下创建新的功能模块
2. 定义类型在 `app/types/`
3. 创建 API 服务在 `app/services/api/`
4. 添加常量到 `app/lib/constants.ts`

### 修改现有功能

1. 定位到对应的功能模块
2. 修改组件或逻辑
3. 更新类型定义（如需要）
4. 运行 lint 检查

### 调试

使用统一的日志系统：
```typescript
import { logger } from '@/app/lib/logger';

logger.debug('调试信息', { data });
logger.info('操作成功', { result });
logger.warn('警告', { context });
logger.error('错误', error, { context });
```

---

## 常见问题

### Q: 如何添加新的步骤？

A: 
1. 在 `steps/` 目录下创建新的步骤组件
2. 更新 `WizardState` 类型
3. 在 `TopicWizardContainer` 中添加路由
4. 更新 `WIZARD_STEPS` 常量

### Q: 如何修改轮询间隔？

A: 修改 `app/lib/constants.ts` 中的 `POLLING_CONFIG`

### Q: 如何添加新的 API 端点？

A: 
1. 在 `app/services/api/` 创建新的服务文件
2. 使用 `apiClient` 进行请求
3. 定义类型在 `app/types/api.types.ts`

---

## 更新日志

### v2.0.0 (2025-11-19) - 架构重构

- ✅ 将 866 行的 page.tsx 重构为 19 行
- ✅ 引入分层架构和模块化设计
- ✅ 添加统一的错误处理和日志系统
- ✅ 实现 Context 状态管理
- ✅ 组件拆分和 memo 优化
- ✅ 添加 ErrorBoundary 错误边界

---

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 许可证

MIT License

---

## 联系方式

如有问题，请提交 Issue 或联系维护团队。

