# 小红书排版工具 - 实现计划（MVP 1.0）

## 📌 项目概述

将 AI 对话记录或整理好的内容，通过 AI 智能转换为对话形式，并生成适合小红书尺寸（3:4 或 9：16）的精美卡片图片。

---

## 🛠 技术栈

### 前端框架
- **React 18** + **TypeScript**
- **Vite**（构建工具，快速开发）
- **Tailwind CSS**（样式框架）

### 核心依赖
- `@google/generative-ai` - Gemini API 客户端
- `marked` 或 `markdown-it` - Markdown 解析
- `html2canvas` - 图片生成
- `file-saver` - 文件下载
- `jszip` - 批量下载 ZIP 压缩包

---

## 📁 项目结构

```
xhs排版工具/
├── src/
│   ├── components/              # 组件目录
│   │   ├── InputArea/           # 输入区域组件
│   │   │   ├── InputArea.tsx
│   │   │   └── InputArea.module.css
│   │   ├── PreviewCard/         # 预览卡片组件
│   │   │   ├── PreviewCard.tsx
│   │   │   └── CardPreview.tsx
│   │   ├── TemplateSelector/    # 模板选择器
│   │   │   └── TemplateSelector.tsx
│   │   ├── ExportPanel/         # 导出面板
│   │   │   └── ExportPanel.tsx
│   │   └── ApiKeyInput/         # API Key 输入组件
│   │       └── ApiKeyInput.tsx
│   ├── core/                    # 核心逻辑
│   │   ├── ai/                  # AI 服务
│   │   │   ├── gemini-service.ts      # Gemini API 封装
│   │   │   ├── prompt-template.ts     # Prompt 模板
│   │   │   └── types.ts               # AI 相关类型
│   │   ├── parser/              # 解析器
│   │   │   └── markdown-parser.ts
│   │   ├── transformer/         # 内容转换器
│   │   │   ├── dialogue-transformer.ts # 对话转换器（使用 AI）
│   │   │   └── types.ts
│   │   ├── splitter/            # 内容拆分器
│   │   │   └── content-splitter.ts
│   │   └── generator/           # 图片生成器
│   │       └── image-generator.ts
│   ├── templates/               # 模板系统
│   │   ├── base/                # 基础模板
│   │   │   ├── BaseTemplate.tsx
│   │   │   └── types.ts
│   │   ├── Minimalist.tsx       # 极简风模板
│   │   ├── DarkMode.tsx         # 深色模式模板
│   │   └── BubbleChat.tsx       # 对话气泡风模板
│   ├── types/                   # TypeScript 类型定义
│   │   ├── dialogue.ts
│   │   └── template.ts
│   ├── utils/                   # 工具函数
│   │   ├── storage.ts           # localStorage 管理
│   │   └── constants.ts         # 常量定义
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useGemini.ts         # Gemini API Hook
│   │   └── useImageGenerator.ts # 图片生成 Hook
│   ├── App.tsx
│   └── main.tsx
├── .env.example                 # 环境变量示例
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎯 功能模块详细设计

### 1. 输入端模块

**功能描述：**
- 文本输入/粘贴区域（支持 Markdown）
- 实时字符计数
- 输入验证和格式化

**实现要点：**
- 使用 `textarea` 组件，支持大文本输入
- 提供占位符提示
- 自动检测 Markdown 格式（可选）
- 输入内容持久化（localStorage）

**UI 组件：**
```tsx
<InputArea 
  value={inputText}
  onChange={handleInputChange}
  placeholder="粘贴 AI 对话记录或输入内容..."
/>
```

---

### 2. 处理端模块（核心）

#### 2.1 Markdown 解析器

**功能：**
- 解析 Markdown 格式的输入内容
- 提取代码块、列表、标题等结构化信息
- 转换为纯文本（供 AI 处理）

**实现：**
- 使用 `marked` 库解析 Markdown
- 保留代码块和表格的原始格式（按 Prompt 要求）

---

#### 2.2 AI 内容转换器 ⭐ **核心模块**

**技术选择：**
- **AI 服务：** Google Gemini API
- **SDK：** `@google/generative-ai`

**Prompt 模板（用户提供）：**

```
# Role
你是一个专业的AI产品经理。擅长将杂乱的 AI 对话记录转化为适合社交媒体（如小红书）传播的结构化卡片内容。

# Goal
将输入文本转化为"User（提问者）"与"Assistant（回答者）"的对话。
1. **已有标识**：保留原始问答逻辑。
2. **纯文字墙（核心任务）**：
   - **分步拆解**：严禁直接输出一长段文字。你需要从这段话中挖掘出隐含的逻辑节点（如：定义、方法、案例、总结）。
   - **拟人化提问**：针对每个节点，以 User 的身份设计短促、自然的提问或追问（例如："那怎么做呢？"、"能举个例子吗？"、"有简单理解的方法吗？"）。
   - **节奏控制**：每轮 Assistant 的回答应集中解决一个子问题，模拟真实的聊天节奏。

# Workflow
1. **内容扫描**：识别全文核心观点及转折处。
2. **逻辑分片**：将长文切分为 3-5 个逻辑模块。
3. **角色模拟**：
   - [User]: 负责好奇、追问、总结。
   - [Assistant]: 负责深度解析、分点说明、专业指导。
4. **视觉优化**：如果 Assistant 回复仍超过 300 字，必须进一步拆分为连续的两条回复。

# Output Format (Strict JSON)
{
  "title": "符合小红书爆款风格的封面标题",
  "content": [
    {
      "role": "user",
      "text": "内容文本"
    },
    {
      "role": "assistant",
      "text": "内容文本"
    }
  ]
}

# Constrains
- 对于无标识文本，严禁只输出一个 User 和一个 Assistant。拆分时保持原始语义，不要过度修饰。 
- **互动感**：User 的语气要像真人
- 确保 JSON 语法正确。 
- 遇到代码块、表格时，请保持其 Markdown 格式完整。   
```

**数据结构：**

```typescript
// src/types/dialogue.ts
export interface DialogueItem {
  role: 'user' | 'assistant';
  text: string;
}

export interface AITransformResult {
  title: string;
  content: DialogueItem[];
}
```

**实现架构：**

1. **Gemini 服务封装** (`src/core/ai/gemini-service.ts`)
   - 初始化 Gemini 客户端
   - 调用 API 方法
   - 错误处理和重试机制
   - 流式输出支持（可选）

2. **Prompt 构建器** (`src/core/ai/prompt-template.ts`)
   - 整合用户提供的 Prompt
   - 动态插入用户输入内容
   - 处理特殊字符转义

3. **对话转换器** (`src/core/transformer/dialogue-transformer.ts`)
   - 调用 AI 服务
   - 解析 JSON 响应
   - 验证输出格式
   - 处理异常情况

**API Key 管理（混合方案）：**

```typescript
// src/utils/api-key-manager.ts
export const getApiKey = (): string => {
  // 1. 优先使用用户输入的 Key（localStorage）
  const userKey = localStorage.getItem('gemini_api_key');
  if (userKey) return userKey;
  
  // 2. 使用环境变量（开发/默认）
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  
  // 3. 返回空字符串，提示用户输入
  return '';
};
```

**用户界面：**
- 设置面板中提供 API Key 输入框
- 保存到 localStorage（不清除，用户下次使用）
- 提供"使用默认 Key"选项（有限制）

---

#### 2.3 内容拆分器（适配小红书尺寸）

**功能：**
- 将对话内容拆分为适合卡片显示的片段
- 支持两种尺寸：3:4（1080x1440px）和 1:1（1080x1080px）

**拆分策略：**
- **3:4 竖版卡片：** 每张卡片容纳 4-6 轮对话
- **1:1 方图卡片：** 每张卡片容纳 3-4 轮对话
- 保持对话完整性（不截断单条消息）
- 动态计算文本占用空间

**数据结构：**

```typescript
// src/types/splitter.ts
export interface CardContent {
  dialogueItems: DialogueItem[];
  cardIndex: number;
  totalCards: number;
}

export type CardSize = '3:4' | '1:1';
```

---

### 3. 视觉端模块

#### 3.1 模板系统架构

**基础接口：**

```typescript
// src/templates/base/types.ts
export interface TemplateProps {
  title: string;
  dialogueItems: DialogueItem[];
  cardSize: CardSize;
  cardIndex: number;
  totalCards: number;
}

export interface ITemplate {
  name: string;
  displayName: string;
  component: React.ComponentType<TemplateProps>;
  preview: string; // 预览图 URL
}
```


#### 3.4 对话气泡风模板 ⭐ **重点模板**

**设计特点：**
- 模拟即时通讯软件（微信/Telegram）
- 用户消息：右侧气泡（绿色/蓝色系）
- AI 消息：左侧气泡（白色/浅灰）
- 圆角气泡设计
- 适当的内边距和阴影
- 沉浸式体验

**实现细节：**
- 使用 CSS 实现气泡样式
- 响应式布局适配不同卡片尺寸
- 优化字体大小和行高

---

### 4. 输出端模块

#### 4.1 图片生成

**技术方案：**
- 使用 `html2canvas` 将 React 组件转换为图片
- 设置高 DPI（2x 或 3x）保证清晰度
- 批量生成多张卡片

**实现流程：**
1. 渲染模板组件到隐藏的 DOM
2. 使用 html2canvas 截图
3. 转换为 Blob
4. 触发下载

#### 4.2 导出功能

**功能：**
- 单张下载（PNG 格式）
- 批量下载（ZIP 压缩包）
- 进度提示
- 错误处理

---

## 📅 实施步骤（开发顺序）

### Phase 1: 项目初始化（1 天）
- [ ] 初始化 Vite + React + TypeScript 项目
- [ ] 配置 Tailwind CSS
- [ ] 搭建基础布局结构
- [ ] 配置环境变量（.env.example）
- [ ] 创建基础组件骨架

### Phase 2: AI 集成（2-3 天）⭐ **核心**
- [ ] 安装 `@google/generative-ai` 依赖
- [ ] 实现 Gemini 服务封装
- [ ] 整合用户提供的 Prompt 模板
- [ ] 实现对话转换器
- [ ] 实现 API Key 管理（混合方案）
- [ ] 创建 API Key 输入 UI 组件
- [ ] 错误处理和加载状态
- [ ] 测试不同内容的转换效果

### Phase 3: 内容处理（2 天）
- [ ] 实现 Markdown 解析器
- [ ] 集成 AI 转换结果处理
- [ ] 实现内容拆分器（3:4 和 1:1）
- [ ] 测试拆分逻辑

### Phase 4: 模板系统（3 天）
- [ ] 设计模板基础接口
- [ ] 实现极简风模板
- [ ] 实现深色模式模板
- [ ] 实现对话气泡风模板（重点）
- [ ] 实现模板选择器组件
- [ ] 实现模板切换功能
- [ ] 优化视觉效果

### Phase 5: 图片生成与导出（2-3 天）
- [ ] 安装 `html2canvas` 依赖
- [ ] 实现单张图片生成
- [ ] 实现批量图片生成
- [ ] 安装 `jszip` 和 `file-saver`
- [ ] 实现单张下载功能
- [ ] 实现批量下载（ZIP）
- [ ] 优化图片质量

### Phase 6: 整合与优化（1-2 天）
- [ ] 整合所有模块
- [ ] UI/UX 优化
- [ ] 性能优化（大文本处理）
- [ ] 边界情况处理
- [ ] 错误提示优化
- [ ] 测试完整流程

---

## 🔧 技术难点与解决方案

### 1. AI 输出格式验证
**问题：** Gemini 可能返回非标准 JSON 或格式错误

**解决方案：**
- 使用 `JSON.parse()` 前进行预处理（去除 markdown 代码块标记）
- 实现 JSON 修复函数（处理常见错误）
- 提供重试机制
- 友好的错误提示

### 2. 内容自动拆分
**问题：** 如何准确计算文本在卡片中的占用空间

**解决方案：**
- 使用 Canvas API 测量文本宽度
- 预设每张卡片的最大对话轮数
- 预留手动调整接口（后续优化）

### 3. 图片生成质量
**问题：** html2canvas 生成的图片可能模糊

**解决方案：**
- 提高 scale 参数（2x 或 3x）
- 优化 CSS 渲染
- 考虑使用 Canvas 直接绘制（后续优化）

### 4. API 调用成本
**问题：** 频繁调用 Gemini API 产生费用

**解决方案：**
- 实现缓存机制（相同内容不重复调用）
- 提供用户自己的 API Key 输入
- 限制默认 Key 的使用频率

---

## 📦 MVP 1.0 交付物

### 功能清单
- ✅ 文本输入（支持 Markdown）
- ✅ AI 内容转换（使用 Gemini API）
- ✅ 对话格式输出（包含 title 和 content）
- ✅ 预设模板对话气泡风
- ✅ 内容拆分（3:4 和 9：16两种尺寸）
- ✅ 单张图片导出
- ✅ 批量图片导出（ZIP）
- ✅ API Key 管理（混合方案）

### 技术文档
- README.md（使用说明）
- .env.example（环境变量示例）
- 代码注释（关键逻辑）

---

## 🚀 后续优化方向（非 MVP）

- [ ] 支持更多卡片尺寸（9:16、4:3 等）
- [ ] 自定义模板编辑器
- [ ] 模板市场
- [ ] 云端保存功能
- [ ] 历史记录管理
- [ ] 流式输出（实时显示 AI 生成过程）
- [ ] 多种 AI 模型支持（Claude、GPT 等）
- [ ] 思维节点自动插入（"我的思考"、"重点笔记"）
- [ ] 导出格式选择（PNG、JPG、PDF）

---

## ⚠️ 注意事项

1. **API Key 安全：** 不将用户的 API Key 发送到服务器，仅在客户端使用
2. **错误处理：** 所有 AI 调用都要有完善的错误处理和用户提示
3. **性能优化：** 大文本处理时考虑分片和异步处理
4. **用户体验：** 提供清晰的加载状态和进度提示
5. **兼容性：** 确保在主流浏览器中正常工作

---

**计划版本：** v1.0  
**最后更新：** 2024-12-19  
**状态：** 待确认 ✅
