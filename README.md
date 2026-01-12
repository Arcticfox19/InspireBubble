# 小红书排版工具

将 AI 对话记录或整理好的内容，通过 AI 智能转换为对话形式，并生成适合小红书尺寸（3:4 或 9:16）的精美卡片图片。

## 功能特性

- ✨ AI 智能转换：使用 Gemini API 将文本转换为对话格式
- 🎨 精美模板：对话气泡风格，模拟即时通讯软件
- 📐 多种尺寸：支持 3:4 和 9:16 两种小红书常用尺寸
- 📦 批量导出：支持单张或批量导出（ZIP）
- 🔐 API Key 管理：混合方案，支持用户自定义 API Key

## 技术栈

- **前端框架：** React 18 + TypeScript
- **构建工具：** Vite
- **样式框架：** Tailwind CSS
- **AI 服务：** Google Gemini API
- **图片生成：** html2canvas
- **文件处理：** file-saver, jszip

## 开始使用

### 安装依赖

```bash
npm install
```

### 配置环境变量（可选）

创建 `.env` 文件：

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

如果不设置环境变量，也可以在应用内输入您的 API Key。

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 组件目录
├── core/                # 核心逻辑
│   ├── ai/              # AI 服务
│   ├── parser/          # 解析器
│   ├── transformer/     # 内容转换器
│   ├── splitter/        # 内容拆分器
│   └── generator/       # 图片生成器
├── templates/           # 模板系统
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
└── hooks/               # 自定义 Hooks
```

## 开发状态

- ✅ Phase 1: 项目初始化
- 🚧 Phase 2: AI 集成（进行中）
- ⏳ Phase 3: 内容处理
- ⏳ Phase 4: 模板系统
- ⏳ Phase 5: 图片生成与导出
- ⏳ Phase 6: 整合与优化

## 许可证

MIT
