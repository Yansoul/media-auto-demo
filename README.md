# AI 自媒体选题助手

一个基于 **Next.js 15** 的智能选题系统，帮助自媒体创作者快速获取优质内容选题建议。通过 AI 分析和飞书多维表格集成，实现智能化的选题推荐。

## 核心特性

### 🎯 智能选题生成
- 四步式选题配置流程（可选基础版/详细版）
- AI 分析行业趋势和爆款视频特征
- 自动生成多个优质选题建议
- 智能评分系统评估选题契合度

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

### 🔧 技术先进
- **Next.js 15 App Router**：现代 React 框架
- **TypeScript 5**：严格的类型安全保障
- **Tailwind CSS**：高效灵活的样式系统
- **飞书多维表格集成**：强大的后端数据管理

## 快速开始

### 前置要求

- Node.js 18+ 或 20+
- pnpm 9+（推荐）
- 飞书开放平台账号和凭证
- TikHub API 密钥（可选，用于行业分类数据）

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

复制示例配置文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的凭证信息：

```bash
# TikHub API 配置（可选，用于获取抖音行业分类数据）
TIKUB_API_KEY=your_tikhub_api_key_here

# 飞书 API 凭证
FEISHU_ACCESS_KEY_ID=your_feishu_access_key_id_here
FEISHU_SECRET_ACCESS_KEY=your_feishu_secret_access_key_here
FEISHU_APP_TOKEN=your_feishu_app_token_here

# 飞书多维表格 ID
FEISHU_TABLE_ID_TASK=your_task_table_id_here       # 任务状态表
FEISHU_TABLE_ID_TOPIC=your_topic_table_id_here     # 选题结果表
```

4. **启动开发服务器**

```bash
pnpm dev
```

5. **访问应用**

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 生产部署

1. **构建应用**

```bash
pnpm build
```

2. **启动生产服务器**

```bash
pnpm start
```

## 功能详解

### 选题配置流程

应用提供两种配置模式：

#### 基础版（快速上手）
1. **输入需求描述**：简单描述你的选题需求
2. **提交任务**：一键提交，等待 AI 生成结果

#### 详细版（推荐）
1. **选择行业领域**：从 抖音分类数据库 中选择行业
2. **选择细分赛道**：选择该行业下的具体赛道
3. **上传历史文案（可选）**：输入 3-5 个你的爆款视频文案，帮助 AI 学习你的创作风格
4. **提交任务**：提交详细的配置信息

### 智能轮询系统

应用会自动轮询飞书多维表格，实时获取任务进度：

1. **任务状态检查**：每 3 秒检查一次任务是否完成
2. **结果数据获取**：任务完成后自动获取选题建议
3. **增量更新**：新结果实时追加到列表顶部
4. **自动终止**：任务完成或达到最大轮询次数后自动停止

### 选题结果展示

每个选题结果包含：

- **标题**：简洁明了的选题标题
- **契合度评分**：70-100 分，带颜色标识
  - 🟢 90-100 分：极佳匹配
  - 🔵 80-89 分：良好匹配
  - 🟡 70-79 分：一般匹配
- **分析理由**：为什么这个选题适合你
- **执行策略**：具体的创作方向建议（Markdown 格式）
- **参考视频**：相关的参考案例链接
- **创建时间**：结果的生成时间

## 项目结构

```
media-auto-demo/
├── app/                          # Next.js App Router 目录
│   ├── api/                      # API 路由
│   │   ├── categories/           # 抖音分类数据接口
│   │   │   └── route.ts
│   │   ├── feishu/               # 飞书 API 代理接口
│   │   │   ├── task-status/      # 任务状态查询
│   │   │   └── topic-results/    # 选题结果查询
│   │   └── task-status/          # 备用任务状态接口
│   ├── components/               # React 组件
│   │   └── TopicResultCard.tsx   # 选题结果卡片
│   ├── hooks/                    # 自定义 Hooks
│   │   └── useFeishuPolling.ts   # 飞书轮询逻辑
│   ├── services/                 # 服务层
│   │   └── feishuApi.ts          # 飞书 API 封装
│   ├── types/                    # TypeScript 类型定义
│   │   └── topic.ts              # 选题相关类型
│   ├── globals.css               # 全局样式
│   ├── heroui-plugin.ts          # HeroUI 插件配置
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页面（核心业务逻辑）
│   └── providers.tsx             # HeroUI Provider
├── .env.local.example            # 环境变量示例
├── CLAUDE.md                     # Claude Code 项目指引
├── IMPLEMENTATION_SUMMARY.md     # 飞书轮询功能实现总结
├── README.md                     # 本文档
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind 配置
└── postcss.config.mjs            # PostCSS 配置
```

## 配置说明

### 飞书多维表格配置

应用需要两个飞书多维表格：

#### 1. 任务状态表 (`FEISHU_TABLE_ID_TASK`)

用于跟踪选题任务的执行状态：

| 字段名      | 类型   | 说明                                                         |
| ----------- | ------ | ------------------------------------------------------------ |
| Job ID      | 文本   | 任务唯一标识符                                               |
| Status      | 单选   | 任务状态（processing / finished）                            |
| Created At  | 日期   | 任务创建时间                                                 |
| Updated At  | 日期   | 任务更新时间                                                 |

#### 2. 选题结果表 (`FEISHU_TABLE_ID_TOPIC`)

用于存储 AI 生成的选题建议：

| 字段名               | 类型   | 说明                                   |
| -------------------- | ------ | -------------------------------------- |
| Job ID               | 文本   | 关联的任务 ID                          |
| 标题                 | 文本   | 选题标题                               |
| 契合度评分           | 数字   | 70-100 的评分                          |
| 分析理由             | 文本   | 为什么推荐这个选题                     |
| 执行策略             | 文本   | Markdown 格式的创作建议                |
| 参考视频链接         | 文本   | 参考案例的链接（逗号分隔）             |
| 创建时间             | 日期   | 记录创建时间                           |

### TikHub API 配置（可选）

如果你想要启用行业分类选择功能：

1. 访问 [TikHub.io](https://tikhub.io) 注册账号
2. 获取 API 密钥
3. 在环境变量中添加 `TIKUB_API_KEY`

如果没有配置 TikHub API，应用仍可使用基础模式运行。

## API 接口

### 内部 API 路由

#### `GET /api/categories`

获取抖音内容标签分类数据。

**缓存策略**：使用 Next.js `unstable_cache` 缓存 24 小时

**返回示例**：

```json
{
  "categories": [
    {
      "id": "1",
      "name": "美食",
      "subcategories": [
        { "id": "1-1", "name": "探店" },
        { "id": "1-2", "name": "食谱" }
      ]
    }
  ]
}
```

#### `GET /api/feishu/task-status?jobId={jobId}`

查询任务状态。

**参数**：
- `jobId` (string): 任务 ID

**返回值**：
- `jobId`: 任务 ID
- `status`: 任务状态（`processing` | `finished`）

#### `GET /api/feishu/topic-results?jobId={jobId}`

获取选题结果列表。

**参数**：
- `jobId` (string): 任务 ID

**返回示例**：

```json
{
  "topics": [
    {
      "jobId": "xxx",
      "标题": "如何在家做正宗重庆火锅",
      "契合度评分": 95,
      "分析理由": "这个选题符合当前季节热点...",
      "执行策略": "1. 开头展示火锅底料\n2. 详细讲解调料配比",
      "参考视频链接": "https://example.com/video1, https://example.com/video2",
      "创建时间": "2025-01-18T10:00:00Z"
    }
  ]
}
```

### 外部 API

#### 任务提交 Webhook

任务提交到：`http://localhost:5678/webhook-test/topic-helper`

**请求方法**：POST

**请求体**：

```json
{
  "jobId": "唯一任务 ID",
  "industry": "行业名称（可选）",
  "niche": "细分赛道（可选）",
  "requirements": "详细需求描述",
  "pastScripts": ["历史文案 1", "历史文案 2"]  // 可选
}
```

**响应**：

```json
{
  "success": true,
  "message": "任务已提交"
}
```

## 开发指南

### 代码规范

- 使用 **TypeScript** 严格模式
- 优先使用 **HeroUI 组件**构建 UI
- 使用 **Tailwind CSS** 自定义样式（原子化类名）
- 自定义 Hook 放在 `app/hooks/` 目录下
- 服务层代码放在 `app/services/` 目录下
- 组件文件以 `.tsx` 结尾

### 使用 HeroUI 组件

项目中使用 HeroUI 作为 UI 组件库：

```tsx
import { Button, Card, Input, Select, Spinner } from "@heroui/react";

// 示例
<Button color="primary" variant="solid">
  提交任务
</Button>

<Card className="p-6">
  <h3 className="text-xl font-bold">选题结果</h3>
</Card>
```

更多组件和用法参考 [HeroUI 官方文档](https://heroui.com/docs/introduction)

### 自定义 Hook

使用 `useFeishuPolling` Hook 实现轮询：

```typescript
import { useFeishuPolling, TopicResult } from "@/app/hooks/useFeishuPolling";

const { isPolling, pollingState, results, error } = useFeishuPolling(jobId);
```

### 类型安全

项目中使用 TypeScript 严格模式，所有类型定义在 `app/types/`：

```typescript
import { TopicResult, PollingState } from "@/app/types/topic";

const result: TopicResult = {
  jobId: "xxx",
  "标题": "选题标题",
  "契合度评分": 95,
  // ...
};
```

### 环境变量

使用 `process.env` 访问环境变量：

```typescript
const apiKey = process.env.TIKUB_API_KEY;
```

注意：
- 客户端组件中只能访问 `NEXT_PUBLIC_` 前缀的变量
- API 路由中可以直接访问所有环境变量

## 部署建议

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量（所有 `.env.local` 中的变量）
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
pnpm add -g pm2
pm2 start pnpm -- start --name media-auto-demo
```

### Docker（可选）

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

构建和运行：

```bash
docker build -t media-auto-demo .
docker run -p 3000:3000 --env-file .env.local media-auto-demo
```

## 文档资源

-  **[CLAUDE.md](./CLAUDE.md)**  - Claude Code 项目开发指南，包含技术栈细节和开发规范
-  **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**  - 飞书轮询功能实现详细总结

## 贡献指南

我们欢迎各种形式的贡献：

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'Add amazing feature'`)
4. **推送到分支** (`git push origin feature/amazing-feature`)
5. **创建 Pull Request**

## 许可证

MIT

## 支持

如有问题或建议，请：

- 查看现有文档（CLAUDE.md 和 IMPLEMENTATION_SUMMARY.md）
- 提交 GitHub Issue
- 联系开发团队

---

## 项目亮点

### ✅ 优秀的代码质量
- TypeScript 严格模式，完整的类型安全
- 清晰的分层架构（Service → API → Hook → UI）
- 通过 ESLint 检查，规范的代码风格
- 详细的注释和文档

### ✅ 出色的用户体验
- 流畅的页面切换动画（Framer Motion）
- 实时进度反馈和状态展示
- 清晰的错误提示和引导
- 深色模式自动适配

### ✅ 健壮的错误处理
- API 调用失败自动重试
- 轮询超时自动终止
- 友好的错误提示界面
- 资源自动清理，避免内存泄漏

### ✅ 良好的可维护性
- 模块化设计，低耦合高内聚
- 可配置的轮询参数
- 完善的环境变量管理
- 详尽的开发和部署文档

---

**开始你的智能选题之旅吧！🚀**
