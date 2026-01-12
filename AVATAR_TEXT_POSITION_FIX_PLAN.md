# 头像文字位置修复计划

## 问题分析

### 当前状态
1. **CSS 设置**（`WysiwygPreview.css`）：
   - `align-items: center` - 垂直居中
   - `justify-content: center` - 水平居中
   - 预览界面应该显示正常

2. **导出时的问题**（`wysiwyg-generator cp.ts`）：
   - 第123行：`alignItems: avatarComputed.alignItems || 'flex-start'`
   - 如果获取不到计算样式，fallback 是 `'flex-start'`（靠上），这可能导致文字位置不正确
   - html2canvas 对 flex 布局的居中支持可能不完美

### 可能的原因
1. **html2canvas 渲染问题**：html2canvas 可能无法完美渲染 flex 布局的居中
2. **字体基线问题**：文字的基线对齐可能导致视觉上不居中
3. **line-height 影响**：line-height 可能影响垂直位置
4. **fallback 值错误**：导出时如果获取不到样式，使用了 `'flex-start'` 而不是 `'center'`

---

## 修复方案

### 方案1：修复导出时的 fallback 值（最简单）

**位置**：`src/core/generator/wysiwyg-generator cp.ts` 第123行

**修改**：
```typescript
alignItems: avatarComputed.alignItems || 'center', // 改为 center 而不是 flex-start
```

**优点**：简单快速
**缺点**：如果 html2canvas 对 flex 居中支持不好，可能仍然不完美

---

### 方案2：使用绝对定位 + transform（推荐）

**位置**：`src/core/generator/wysiwyg-generator cp.ts` 第121-135行

**修改思路**：
- 不使用 flex 布局居中
- 使用绝对定位 + `transform: translate(-50%, -50%)` 实现完美居中
- 或者使用 `line-height` 等于容器高度实现垂直居中

**具体修改**：
```typescript
applyStyles(avatar, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // 添加以下属性确保完美居中
  lineHeight: avatarComputed.height || '38px', // 行高等于容器高度，实现垂直居中
  textAlign: 'center', // 水平居中
  // 或者使用绝对定位方案
  position: 'relative', // 如果需要绝对定位
});
```

---

### 方案3：同时修复 CSS 和导出代码（最彻底）

**步骤1**：修改 CSS（`WysiwygPreview.css`）
```css
.wysiwyg-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 38px; /* 添加：行高等于高度，辅助垂直居中 */
  text-align: center; /* 添加：水平居中 */
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
```

**步骤2**：修改导出代码（`wysiwyg-generator cp.ts`）
```typescript
applyStyles(avatar, {
  display: 'flex',
  alignItems: 'center', // 改为 center
  justifyContent: 'center',
  lineHeight: avatarComputed.height || '38px', // 添加：行高等于高度
  textAlign: 'center', // 添加：水平居中
  width: avatarComputed.width || '38px',
  height: avatarComputed.height || '38px',
  // ... 其他样式
});
```

---

### 方案4：使用 padding 微调（如果方案3不够）

如果文字仍然偏下，可以添加负的 `padding-top` 或调整 `line-height`：

```typescript
applyStyles(avatar, {
  // ... 其他样式
  lineHeight: '1', // 使用 1 而不是容器高度
  paddingTop: '2px', // 微调向上移动
  // 或者
  transform: 'translateY(-1px)', // 向上移动 1px
});
```

---

## 推荐执行顺序

1. **第一步**：修复 fallback 值（方案1）- 快速测试
2. **第二步**：如果不行，添加 `line-height` 和 `text-align`（方案3）
3. **第三步**：如果还不行，使用 `padding-top` 或 `transform` 微调（方案4）

---

## 注意事项

1. **预览和导出一致性**：确保修改后预览和导出的效果一致
2. **测试不同字体**：不同字体可能有不同的基线，需要测试
3. **html2canvas 限制**：某些 CSS 属性可能不被 html2canvas 支持，需要实际测试
