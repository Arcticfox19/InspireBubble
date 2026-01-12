# 预览 vs 导出差异分析

## 预览渲染流程

### 1. 预览组件位置
- **文件**: `src/components/WysiwygPreview/WysiwygPreview.tsx`
- **渲染方式**: React 组件，浏览器原生 DOM 渲染
- **CSS 应用**: 通过 `WysiwygPreview.css` 文件中的类选择器应用样式

### 2. 预览的 DOM 结构
```tsx
<div className="wysiwyg-preview-container">  {/* 外层容器 */}
  <div className="wysiwyg-preview-card">     {/* 卡片容器 - cardRef */}
    <div className="wysiwyg-title-wrapper">
      <h1 className="wysiwyg-title">...</h1>
    </div>
    <div className="wysiwyg-message-list">
      <div className="wysiwyg-message wysiwyg-message-user">
        <div className="wysiwyg-avatar">ME</div>
        <div className="wysiwyg-bubble">...</div>
      </div>
      <div className="wysiwyg-message wysiwyg-message-assistant">
        <div className="wysiwyg-avatar">AI</div>
        <div className="wysiwyg-bubble">...</div>
      </div>
    </div>
  </div>
</div>
```

### 3. 样式应用方式
- **CSS 类选择器**: `.wysiwyg-bubble`, `.wysiwyg-message-assistant .wysiwyg-bubble` 等
- **浏览器原生渲染**: 浏览器直接解析 CSS，应用样式
- **CSS 变量**: 使用 `var(--bg-gradient-start)` 等 CSS 变量
- **伪元素**: `::after` 伪元素用于噪点背景
- **CSS 继承**: 样式通过 CSS 层叠规则自然继承

### 4. 关键 CSS 样式（来自 WysiwygPreview.css）
```css
.wysiwyg-bubble {
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.6;  /* 相对值 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.wysiwyg-message-assistant .wysiwyg-bubble {
  border: 1px solid var(--ai-border);
  border-top-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);  /* AI气泡投影 */
}
```

---

## 导出渲染流程

### 1. 导出入口
- **文件**: `src/App.tsx`
- **获取元素**: `previewContainerRef.current.querySelector('.wysiwyg-preview-card')`
- **传入函数**: `downloadSingleImage(cardElement, exportRatio)` 或 `generateSplitImages(cardElement, ratio)`

### 2. 导出流程
```typescript
// 1. 创建临时容器（createSandboxContainer）
const tempContainer = createSandboxContainer(
  containerElement,  // 原始的 .wysiwyg-preview-card 元素
  messageIndices,
  width,
  height,
  includeTitle
);

// 2. 克隆消息节点
const clonedMessage = allMessages[index].cloneNode(true);

// 3. 使用 html2canvas 截图
const canvas = await html2canvas(tempContainer, {
  onclone: (clonedDoc) => {
    injectStylesInClone(clonedDoc, containerElement);
  }
});
```

### 3. 导出时的问题

#### 问题1：DOM 克隆导致样式丢失
- `cloneNode(true)` 会复制 DOM 结构和类名
- **但**：克隆的节点不在原始文档中，CSS 类选择器的样式可能无法完全应用
- **解决方法**：在 `createSandboxContainer` 中手动设置内联样式

#### 问题2：临时容器位置
```typescript
outerContainer.style.position = 'fixed';
outerContainer.style.left = '-9999px';  // 移出视口
```
- 元素在视口外，某些 CSS 计算可能不同
- `getComputedStyle` 可能返回不同的值

#### 问题3：html2canvas 渲染引擎差异
- html2canvas 使用 Canvas API 渲染，不是浏览器原生渲染
- 对某些 CSS 特性的支持有限：
  - `box-shadow` 可能不支持或渲染不准确
  - `line-height` 的计算方式可能不同
  - 字体基线对齐可能不同
  - CSS 变量可能无法正确解析

#### 问题4：样式注入时机
- `injectStylesInClone` 在 html2canvas 的 `onclone` 回调中执行
- html2canvas 可能已经计算了样式，后续修改可能无效

---

## 为什么导出和预览不一样？

### 1. 渲染引擎不同
- **预览**: 浏览器原生渲染引擎（Blink/Gecko/WebKit）
- **导出**: html2canvas 的 Canvas 渲染引擎

### 2. CSS 应用方式不同
- **预览**: CSS 类选择器 → 浏览器解析 → 应用样式
- **导出**: 
  - 克隆 DOM → CSS 类可能失效
  - 手动设置内联样式 → 可能不完全
  - html2canvas 解析 → 可能丢失某些样式

### 3. 样式计算时机不同
- **预览**: 浏览器实时计算和应用样式
- **导出**: 
  - 克隆时样式已计算
  - `onclone` 回调中修改可能无效
  - html2canvas 重新计算，但算法不同

### 4. 具体差异点

#### A. box-shadow 不显示
- **原因**: html2canvas 可能无法正确渲染 box-shadow，特别是在临时容器中
- **日志显示已设置**: `rgba(0, 0, 0, 0.08) 0px 2px 8px`
- **但导出图片中没有**: html2canvas 可能忽略了该样式

#### B. 文字位置偏下
- **原因**: 
  - `line-height: 1.6` 是相对值，html2canvas 计算方式不同
  - 字体基线对齐算法不同
  - `padding-top: 14px` 可能被处理不同

---

## 解决方案建议

### 方案1：直接截图预览元素（推荐但可能不适用）
```typescript
// 直接截图预览元素，不创建临时容器
const canvas = await html2canvas(cardElement, {
  scale: 3,
  backgroundColor: null,
});
```
**问题**: 如果预览元素在视口外或被遮挡，可能无法正确截图

### 方案2：确保样式在克隆时就存在（当前方案）
- 在 `createSandboxContainer` 中直接设置所有样式
- 使用内联样式而不是依赖 CSS 类
- 使用 `setProperty` 添加 `!important`

### 方案3：使用精确的像素值
- `line-height`: 使用像素值而不是相对值（如 `24px` 而不是 `1.6`）
- `padding`: 使用明确的像素值
- `font-size`: 使用像素值

### 方案4：调整 html2canvas 配置
```typescript
const canvas = await html2canvas(tempContainer, {
  scale: 3,
  useCORS: true,
  logging: true,
  allowTaint: false,
  backgroundColor: null,
  // 尝试添加这些选项
  removeContainer: false,
  imageTimeout: 0,
  onclone: (clonedDoc) => {
    // 确保样式在克隆文档中正确设置
  }
});
```

---

## 根本原因总结

1. **html2canvas 不是完美的浏览器渲染引擎**
   - 它试图模拟浏览器渲染，但不可能完全一致
   - 某些 CSS 特性支持有限或不准确

2. **DOM 克隆导致样式上下文丢失**
   - 克隆的节点不在原始文档中
   - CSS 类选择器可能无法完全应用
   - 需要手动设置内联样式

3. **样式计算时机问题**
   - html2canvas 在克隆时可能已经计算了样式
   - `onclone` 回调中修改可能无效
   - 需要在克隆之前就设置样式

4. **临时容器位置影响**
   - `position: fixed; left: -9999px` 可能影响样式计算
   - 某些 CSS 值（如 `getComputedStyle`）可能不同
