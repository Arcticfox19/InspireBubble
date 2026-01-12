# 导出问题分析和解决方案

## 问题1：AI气泡投影不显示

### 问题现象
- 日志显示投影已经被设置：`rgba(0, 0, 0, 0.08) 0px 2px 8px`
- 但导出的图片中没有显示投影效果

### 可能的原因

#### 原因1：html2canvas 在 onclone 回调中修改样式后，无法正确渲染
html2canvas 在克隆文档后，可能在内部已经计算了样式，后续在 onclone 回调中修改样式可能不会生效。

**解决方案A（推荐）**：在创建临时容器时就设置投影样式
- 在 `createSandboxContainer` 函数中，克隆消息节点时，直接为AI气泡设置 `box-shadow` 内联样式
- 这样样式会在克隆之前就存在，html2canvas 可以正确捕获

**解决方案B**：使用 `setProperty` 并添加 `!important`
```typescript
bubbleEl.style.setProperty('box-shadow', '0 2px 8px rgba(0, 0, 0, 0.08)', 'important');
```

**解决方案C**：在克隆后立即设置样式，而不是在 onclone 回调中
- 在 `createSandboxContainer` 返回容器后，立即遍历并设置样式
- 然后再传给 html2canvas

#### 原因2：html2canvas 对 rgba 颜色的 box-shadow 支持问题
某些版本的 html2canvas 可能对 rgba 颜色的 box-shadow 支持不好。

**解决方案**：尝试使用十六进制颜色
```typescript
bubbleEl.style.boxShadow = '0 2px 8px #00000014'; // rgba(0,0,0,0.08) 转为十六进制
```

#### 原因3：投影值太淡，在高分辨率下不明显
scale: 3 可能导致投影在视觉上不明显。

**解决方案**：稍微增强投影
```typescript
bubbleEl.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)'; // 从 0.08 提高到 0.12
```

---

## 问题2：文字位置偏下

### 问题现象
- 导出的图片中，文字相对于气泡上边缘的距离比预览时更大
- 文字整体位置偏下

### 可能的原因

#### 原因1：line-height 计算方式不同
html2canvas 可能使用不同的基线算法来计算文字位置，导致 line-height 的表现与浏览器不一致。

**解决方案A（推荐）**：使用精确的数值而不是相对值
```typescript
// 不要使用 '1.6'，使用具体的像素值
const fontSize = parseInt(bubbleComputed.fontSize) || 15;
bubbleEl.style.lineHeight = `${fontSize * 1.6}px`; // 15 * 1.6 = 24px
```

**解决方案B**：减少 line-height 的值
```typescript
bubbleEl.style.lineHeight = '1.4'; // 从 1.6 降低到 1.4
```

#### 原因2：padding-top 的处理问题
html2canvas 可能对 padding 的处理与浏览器有差异。

**解决方案**：确保 padding 使用具体的像素值
```typescript
bubbleEl.style.padding = '14px 18px'; // 确保使用明确的像素值
// 不要使用 calc() 或其他计算值
```

#### 原因3：字体基线（baseline）问题
html2canvas 可能使用不同的字体基线算法。

**解决方案A**：使用 `vertical-align: top` 或 `vertical-align: baseline`
```typescript
bubbleEl.style.verticalAlign = 'top';
```

**解决方案B**：调整 padding-top 来补偿
```typescript
// 减小 padding-top
bubbleEl.style.padding = '12px 18px 14px 18px'; // top 从 14px 减小到 12px
```

#### 原因4：display 属性问题
气泡可能默认是 inline-block，导致基线对齐问题。

**解决方案**：明确设置 display
```typescript
bubbleEl.style.display = 'block';
// 或者
bubbleEl.style.display = 'inline-block';
bubbleEl.style.verticalAlign = 'top';
```

---

## 推荐的修复方案

### 方案1：在 createSandboxContainer 中直接设置投影（解决投影问题）

在 `createSandboxContainer` 函数的克隆消息部分，直接为AI气泡设置投影：

```typescript
// 深度克隆对应的消息节点
const allMessages = Array.from(containerElement.querySelectorAll('.wysiwyg-message'));
messageIndices.forEach(index => {
  if (allMessages[index]) {
    const clonedMessage = allMessages[index].cloneNode(true) as HTMLElement;
    // ... 其他样式设置 ...
    
    // 在克隆时就设置AI气泡的投影
    if (clonedMessage.classList.contains('wysiwyg-message-assistant')) {
      const bubble = clonedMessage.querySelector('.wysiwyg-bubble') as HTMLElement;
      if (bubble) {
        // 使用 setProperty 并添加 important，或者直接设置
        bubble.style.setProperty('box-shadow', '0 2px 8px rgba(0, 0, 0, 0.08)', 'important');
      }
    }
    
    messageList.appendChild(clonedMessage);
  }
});
```

### 方案2：修正文字位置的 line-height 和 padding（解决文字位置问题）

在 `injectStylesInClone` 函数中：

```typescript
if (originalBubble) {
  const bubbleComputed = window.getComputedStyle(originalBubble);
  const fontSize = parseInt(bubbleComputed.fontSize) || 15;
  
  // 使用精确的像素值计算 line-height
  bubbleEl.style.fontSize = `${fontSize}px`;
  bubbleEl.style.lineHeight = `${Math.round(fontSize * 1.5)}px`; // 使用 1.5 而不是 1.6，并转为像素
  
  // 确保 padding 使用明确的像素值
  bubbleEl.style.padding = '12px 18px'; // 减小顶部 padding 从 14px 到 12px
  
  // 设置 display 和 vertical-align
  bubbleEl.style.display = 'inline-block';
  bubbleEl.style.verticalAlign = 'top';
  
  // ... 其他样式 ...
}
```

---

## 综合修复建议

1. **投影问题**：在 `createSandboxContainer` 中直接设置投影，使用 `setProperty` 添加 `!important`
2. **文字位置问题**：
   - 使用精确的像素值设置 line-height（基于 fontSize 计算）
   - 减小 padding-top（从 14px 到 12px）
   - 设置 vertical-align: top
   - 考虑将 line-height 从 1.6 降低到 1.5
