# AI 自媒体选题助手

一个基于 **Next.js 15** 的智能选题系统，采用现代化的企业级架构，帮助自媒体创作者快速获取优质内容选题建议。

> 🎉 **v2.0 架构重构完成**：从 866 行单文件重构为清晰的分层架构，大幅提升代码可维护性和可测试性！

## ✨ 核心特性

### 🎯 智能选题生成
- 四步式选题配置流程
- AI 分析行业趋势和爆款视频特征
- 自动生成多个优质选题建议
- 智能评分系统评估选题契合度（70-100分）

### ⚡ 实时轮询机制
- **双阶段智能轮询**：自动检测任务状态并获取结果
- **增量更新**：实时追加新结果，无重复数据
- **容错处理**：单次失败自动重试，最多轮询 120 次（约 10 分钟）
- **状态可视化**：清晰的进度展示和状态反馈

### 🎨 现代化 UI 设计
- **HeroUI 组件库**：美观优雅的交互界面
- **深色模式支持**：自动适配系统主题偏好
- **响应式布局**：完美支持桌面和移动设备
- **流畅动画**：Framer Motion 驱动的交互体验

### 🏗️ 企业级架构
- **分层设计**：清晰的 Presentation - Application - Service - Utility 层次
- **模块化**：单个文件不超过 150 行，易于维护
- **类型安全**：TypeScript 严格模式，完整的类型定义
- **错误处理**：统一的错误边界和友好的错误提示
- **日志系统**：结构化日志，区分开发和生产环境

### 🔒 健壮性保障
- **环境变量验证**：启动时自动验证必需配置
- **API 重试机制**：网络请求失败自动重试
- **错误边界**：全局和局部错误捕获，防止白屏
- **缓存策略**：智能缓存用户偏好和 API 响应

---

## 🚀 快速开始

### 前置要求

- Node.js 18+ 或 20+
- pnpm 9+（推荐）
- 飞书开放平台账号和凭证
- TikHub API 密钥（用于行业分类数据）

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd media-auto-demo
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

复制示例配置文件并填入凭证信息：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```bash
# Webhook API 地址（必填）
WEBHOOK_API_URL=http://your-backend-url/webhook/topic-helper

# TikHub API 配置（必填）
TIKUB_API_KEY=your_tikhub_api_key_here

# 飞书 API 凭证（必填）
FEISHU_ACCESS_KEY_ID=your_feishu_access_key_id_here
FEISHU_SECRET_ACCESS_KEY=your_feishu_secret_access_key_here
FEISHU_APP_TOKEN=your_feishu_app_token_here

# 飞书多维表格 ID（必填）
FEISHU_TABLE_ID_TASK=your_task_table_id_here       # 任务状态表
FEISHU_TABLE_ID_TOPIC=your_topic_table_id_here     # 选题结果表
```

4. **启动开发服务器**

```bash
pnpm dev
```

5. **访问应用**

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

---

## 📁 项目架构

### 目录结构

```
app/
├── page.tsx                          # 主页面（19 行，简化为容器）
├── layout.tsx                        # 根布局（带全局 ErrorBoundary）
├── providers.tsx                     # HeroUI Provider
│
├── (features)/                       # 功能模块
│   └── topic-wizard/                 # 选题向导功能
│       ├── TopicWizardContainer.tsx  # 主容器组件
│       ├── context/                  # 状态管理
│       │   ├── WizardContext.tsx     # Context 定义
│       │   └── WizardProvider.tsx    # Provider 实现
│       └── components/               # 向导组件
│           ├── WizardStepper.tsx     # 步骤指示器
│           ├── PollingStatus.tsx     # 轮询状态展示
│           ├── steps/                # 步骤组件
│           │   ├── IndustrySelectStep.tsx  # 第1步：行业选择
│           │   ├── NicheSelectStep.tsx     # 第2步：赛道选择
│           │   ├── ContentScriptsStep.tsx  # 第3步：文案输入
│           │   └── SummaryStep.tsx         # 第4步：确认生成
│           └── TopicResults/         # 结果展示
│               ├── TopicResultsList.tsx    # 结果列表
│               ├── TopicResultCard.tsx     # 结果卡片（重构版）
│               ├── ResultScoreBadge.tsx    # 分数徽章
│               └── ResultAnalysis.tsx      # 分析理由
│
├── components/                       # 通用组件
│   ├── common/                       # 基础组件
│   │   ├── ErrorBoundary.tsx         # 错误边界
│   │   ├── LoadingSpinner.tsx        # 加载状态
│   │   └── ErrorAlert.tsx            # 错误提示
│   ├── CachedPreferencesCard.tsx     # 缓存提示卡片
│   └── ClarityAnalytics.tsx          # 分析统计
│
├── hooks/                            # 通用 Hooks
│   ├── useBeforeUnload.ts            # 页面离开警告
│   ├── useDebouncedEffect.ts         # 防抖 Effect
│   ├── useFeishuPolling.ts           # 飞书轮询逻辑
│   └── useUserPreferences.ts         # 用户偏好管理
│
├── services/                         # 服务层
│   ├── api/                          # API 客户端
│   │   ├── client.ts                 # 统一 HTTP 客户端
│   │   ├── categories.api.ts         # 分类 API
│   │   ├── webhook.api.ts            # Webhook API
│   │   └── retry.ts                  # 重试机制
│   └── feishu/                       # 飞书服务
│       ├── auth.service.ts           # 认证服务
│       ├── task.service.ts           # 任务状态查询
│       └── topic.service.ts          # 选题结果查询
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
    ├── categories/route.ts           # 分类数据接口
    ├── webhook/route.ts              # Webhook 代理
    └── feishu/                       # 飞书 API 代理
        ├── task-status/route.ts      # 任务状态查询
        └── topic-results/route.ts    # 选题结果查询
```

### 架构设计

```
┌─────────────────────────────────────────┐
│          Presentation Layer              │
│  (Components, Pages, UI)                │
│  - TopicWizardContainer                 │
│  - Step Components                       │
│  - Result Components                     │
├─────────────────────────────────────────┤
│         Application Layer                │
│  (Context, Hooks, Business Logic)       │
│  - WizardProvider                        │
│  - useFeishuPolling                      │
│  - useUserPreferences                    │
├─────────────────────────────────────────┤
│          Service Layer                   │
│  (API Services, External Integrations)  │
│  - API Client (统一请求封装)            │
│  - Feishu Services                       │
│  - Webhook Services                      │
├─────────────────────────────────────────┤
│           Utility Layer                  │
│  (Logger, Errors, Constants, Helpers)   │
│  - Logger (结构化日志)                   │
│  - Error Handler (统一错误处理)         │
│  - Constants (全局常量)                  │
└─────────────────────────────────────────┘
```

---

## 🎓 使用指南

### 选题生成流程

1. **第1步：选择行业领域**
   - 从抖音分类数据库中选择行业
   - 支持缓存恢复上次选择

2. **第2步：选择细分赛道**
   - 根据行业选择具体赛道
   - 实时加载赛道数据

3. **第3步：输入历史文案（可选）**
   - 输入 3-10 个历史视频文案
   - AI 学习你的创作风格
   - 支持动态添加和删除

4. **第4步：确认并生成**
   - 查看配置摘要
   - 提交任务
   - 实时查看生成进度

### 选题结果

每个选题包含：

- **标题**：简洁明了的选题标题
- **契合度评分**：70-100 分，带颜色标识
  - 🟢 90-100 分：极佳匹配（绿色）
  - 🔵 80-89 分：良好匹配（蓝色）
  - 🟡 70-79 分：一般匹配（黄色）
- **分析理由**：为什么推荐这个选题（可折叠）
- **执行策略建议**：具体的创作方向（Markdown 格式）
- **参考视频**：相关的参考案例链接
- **创建时间**：结果生成时间

---

## 🛠️ 开发指南

### 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 组件**: HeroUI 2.8
- **状态管理**: React Context API
- **动画**: Framer Motion 12
- **样式**: Tailwind CSS 4
- **语言**: TypeScript 5
- **包管理**: pnpm 9

### 代码规范

1. **组件开发**
   - 单个文件不超过 150 行
   - 使用 `memo` 优化性能
   - Props 类型必须定义

2. **状态管理**
   - 使用 Context 避免 props drilling
   - 使用 `useMemo` 和 `useCallback` 优化

3. **错误处理**
   - 所有 API 调用必须有错误处理
   - 使用统一的 `logger` 记录日志
   - 使用 `normalizeError` 转换错误

4. **类型安全**
   - 不使用 `any` 类型
   - 所有函数参数和返回值必须有类型
   - 使用接口定义复杂对象

### 添加新功能

1. 在 `app/(features)/` 下创建新的功能模块
2. 定义类型在 `app/types/`
3. 创建 API 服务在 `app/services/api/`
4. 添加常量到 `app/lib/constants.ts`

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

## 📊 性能优化

### 已实施的优化

1. **组件优化**
   - 所有步骤组件使用 `React.memo`
   - 结果卡片使用 `memo` 避免重渲染
   - 计算密集型操作使用 `useMemo`

2. **代码分割**
   - 使用 `dynamic` 动态导入向导容器
   - 避免首屏加载过大的 bundle

3. **请求优化**
   - API 客户端支持自动重试
   - 飞书 Token 缓存（提前 5 分钟过期）
   - 分类数据缓存 24 小时

4. **缓存策略**
   - 用户偏好本地缓存
   - API 响应缓存
   - 智能缓存版本控制

---

## 🔒 安全性

### 环境变量管理

- 所有敏感信息存储在环境变量中
- 启动时自动验证必需的环境变量
- 不在客户端暴露敏感信息

### API 安全

- 所有外部 API 请求通过服务端代理
- Webhook URL 只在服务端使用
- 飞书凭证安全存储

### 输入验证

- 表单字段长度限制（文案最大 2000 字符）
- XSS 防护（React 自动转义）
- 用户输入清理和验证

---

## 📚 文档资源

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 详细的架构文档
- **[CLAUDE.md](./CLAUDE.md)** - Claude Code 项目开发指南
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - 飞书轮询功能实现总结

---

## 🚢 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署

**优势**：
- 自动集成 Next.js
- 全球 CDN 加速
- 自动 HTTPS
- 分支预览部署

### 自建服务器

**构建**：

```bash
pnpm build
```

**运行**：

```bash
pnpm start
```

**使用 PM2（生产环境）**：

```bash
npm install -g pm2
pm2 start pnpm -- start --name media-auto-demo
```

---

## 🎯 项目亮点

### ✅ 架构设计

- **模块化设计**：低耦合高内聚
- **分层架构**：职责清晰
- **类型安全**：完整的 TypeScript 支持
- **可测试性**：业务逻辑与 UI 分离

### ✅ 代码质量

- **单一职责**：每个文件不超过 150 行
- **代码复用**：通用组件和 Hooks
- **命名规范**：清晰易懂的命名
- **注释完整**：关键逻辑都有注释

### ✅ 用户体验

- **流畅动画**：Framer Motion 驱动
- **实时反馈**：轮询进度可视化
- **友好提示**：清晰的错误消息
- **智能缓存**：恢复上次配置

### ✅ 健壮性

- **错误边界**：全局和局部错误捕获
- **重试机制**：API 请求自动重试
- **超时控制**：防止无限轮询
- **资源清理**：避免内存泄漏

---

## 📈 更新日志

### v2.0.0 (2025-11-19) - 架构重构

- ✅ 将 866 行的 page.tsx 重构为 19 行
- ✅ 引入分层架构和模块化设计
- ✅ 添加统一的错误处理和日志系统
- ✅ 实现 Context 状态管理
- ✅ 组件拆分和性能优化
- ✅ 添加 ErrorBoundary 错误边界
- ✅ 创建详细的架构文档

### v1.0.0 (2025-01-18) - 初始版本

- ✅ 基础选题向导功能
- ✅ 飞书轮询系统
- ✅ 实时结果展示
- ✅ 用户偏好缓存

---

## 🤝 贡献指南

我们欢迎各种形式的贡献！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 贡献要求

- 遵循项目的代码规范
- 添加必要的注释和文档
- 确保所有 lint 检查通过
- 测试新功能正常工作

---

## 📄 许可证

MIT License

---

## 💬 支持

如有问题或建议，请：

- 查看 [架构文档](./ARCHITECTURE.md)
- 提交 GitHub Issue
- 联系开发团队

---

**开始你的智能选题之旅吧！🚀**

> 💡 **提示**：建议先阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解项目架构设计。
