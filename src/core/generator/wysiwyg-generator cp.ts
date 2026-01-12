import html2canvas from 'html2canvas';
import { ExportRatio, EXPORT_RATIOS } from '@/types/export';

// --- 基础辅助工具 ---

const getCSSVariable = (varName: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

const applyStyles = (el: HTMLElement, styles: Partial<CSSStyleDeclaration>) => {
  Object.assign(el.style, styles);
};


const fixRenderingBug = (el: HTMLElement, isAssistant: boolean) => {
  // 1. 修复文字偏移
  applyStyles(el, {
    display: 'inline-block',
    lineHeight: '1.6',
    verticalAlign: 'top',
    padding: '0px 14px 14px 14px', // 让文字内容更靠近上端
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    boxSizing: 'border-box' 
  });
  
  // 2. 确保气泡样式正确（特别是AI气泡的投影）
  if (isAssistant) {
    applyStyles(el, {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    });
  }
};

// --- 分页与断点逻辑 ---

const findMessageBreakpoints = (container: HTMLElement) => {
  const messages = container.querySelectorAll('.wysiwyg-message') as NodeListOf<HTMLElement>;
  let currentY = 0;
  
  const title = container.querySelector('.wysiwyg-title-wrapper') as HTMLElement;
  if (title) currentY += title.offsetHeight + 24;

  return Array.from(messages).map((msg, i) => {
    const pos = { y: currentY, element: msg, index: i };
    currentY += msg.offsetHeight +24;
    return pos;
  }).concat([{ y: currentY, element: messages[messages.length - 1], index: messages.length }]);
};

export const calculatePageBreaks = (container: HTMLElement, ratio: ExportRatio): number[] => {
  const config = EXPORT_RATIOS[ratio];
  if (ratio === 'full' || config.height === Infinity) return [0];

  const breakpoints = findMessageBreakpoints(container);
  const pageBreaks = [0];
  let lastBreakY = 0;

  for (let i = 1; i < breakpoints.length; i++) {
    if (breakpoints[i].y - lastBreakY > config.height) {
      const breakPoint = breakpoints[i - 1].y;
      pageBreaks.push(breakPoint);
      lastBreakY = breakPoint;
    }
  }
  return pageBreaks;
};

// --- 样式注入 ---

const injectStylesInClone = (clonedDoc: Document, originalContainer: HTMLElement) => {
  const clonedCard = clonedDoc.querySelector('.wysiwyg-preview-card') as HTMLElement;
  if (!clonedCard) return;

  const oriStyle = window.getComputedStyle(originalContainer);
  applyStyles(clonedCard, {
    background: oriStyle.background || oriStyle.backgroundColor,
    borderRadius: '24px',
    boxShadow: 'none', // 移除容器投影防止溢出，气泡自带投影
    padding: '24px',
    width: oriStyle.width || '375px',
    overflow: 'hidden', // 改为 hidden，但确保容器宽度足够
    position: 'relative'
  });
  
  // 确保消息列表容器样式正确
  const messageList = clonedDoc.querySelector('.wysiwyg-message-list') as HTMLElement;
  if (messageList) {
    applyStyles(messageList, {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      position: 'relative',
      zIndex: '3'
    });
  }

  const clonedMessages = clonedDoc.querySelectorAll('.wysiwyg-message');
  clonedMessages.forEach((msg) => {
    const msgEl = msg as HTMLElement;
    const isUser = msgEl.classList.contains('wysiwyg-message-user');
    
    // 修复：user消息应该使用 row-reverse，让头像在右边
    applyStyles(msgEl, {
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: '12px',
      maxWidth: '100%'
    });

    // 处理头像样式，确保文字位置正确
    const avatar = msgEl.querySelector('.wysiwyg-avatar') as HTMLElement;
    if (avatar) {
      const originalAvatar = originalContainer.querySelector('.wysiwyg-avatar') as HTMLElement;
      const avatarComputed = originalAvatar 
        ? window.getComputedStyle(originalAvatar)
        : window.getComputedStyle(avatar);
      applyStyles(avatar, {
        display: 'flex',
        alignItems: avatarComputed.alignItems || 'center', // 垂直对齐：center/flex-start/flex-end
        justifyContent: avatarComputed.justifyContent || 'center', // 水平对齐：center/flex-start/flex-end
        width: avatarComputed.width || '38px',
        height: avatarComputed.height || '38px',
        lineHeight: avatarComputed.height || '38px', // 新增：行高等于容器高度
        borderRadius: avatarComputed.borderRadius || '12px',
        fontWeight: avatarComputed.fontWeight || '800',
        fontSize: avatarComputed.fontSize || '13px',
        flexShrink: '0',
        paddingTop: '-10px',
        boxShadow: avatarComputed.boxShadow || '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        background: avatarComputed.background || avatarComputed.backgroundColor || '',
        color: avatarComputed.color || '',
        border: avatarComputed.border || ''
      });
    }

    const bubble = msgEl.querySelector('.wysiwyg-bubble') as HTMLElement;
    if (bubble) {
      fixRenderingBug(bubble, !isUser);
      // 确保气泡的 max-width 正确设置，防止右侧被切掉
      const originalBubble = originalContainer.querySelector('.wysiwyg-bubble') as HTMLElement;
      const bubbleComputed = originalBubble 
        ? window.getComputedStyle(originalBubble)
        : window.getComputedStyle(bubble);
      applyStyles(bubble, {
        maxWidth: bubbleComputed.maxWidth || 'calc(100% - 60px)',
        width: 'auto',
        boxSizing: 'border-box' // 确保宽度计算包含padding
      });
    }
  });
};

// --- 容器创建 ---

const createSandbox = (
  container: HTMLElement, 
  indices: number[], 
  w: number, 
  h: number, 
  showTitle: boolean
) => {
  const sandbox = document.createElement('div');
  applyStyles(sandbox, {
    position: 'fixed', left: '-9999px', top: '0',
    width: `${w}px`, height: `${h}px`,
    background: getCSSVariable('--bg-gradient-start') || '#e0f2fe',
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start'
  });

  const card = document.createElement('div');
  card.className = 'wysiwyg-preview-card';
  
  if (showTitle) {
    const title = container.querySelector('.wysiwyg-title-wrapper');
    if (title) card.appendChild(title.cloneNode(true));
  }

  const list = document.createElement('div');
  list.className = 'wysiwyg-message-list';
  const allMsgs = container.querySelectorAll('.wysiwyg-message');
  indices.forEach(idx => allMsgs[idx] && list.appendChild(allMsgs[idx].cloneNode(true)));
  
  card.appendChild(list);
  sandbox.appendChild(card);
  return sandbox;
};

// --- 导出核心函数 ---

export const generateSplitImages = async (container: HTMLElement, ratio: ExportRatio): Promise<Blob[]> => {
  const config = EXPORT_RATIOS[ratio];
  const breaks = calculatePageBreaks(container, ratio);
  const allMsgs = container.querySelectorAll('.wysiwyg-message');
  
  const pages = breaks.map((start, i) => {
    const end = breaks[i + 1] || Infinity;
    const bps = findMessageBreakpoints(container);
    return bps.filter(b => b.index < allMsgs.length && b.y >= start && b.y < end).map(b => b.index);
  });

  const blobs: Blob[] = [];
  for (let i = 0; i < pages.length; i++) {
    const isFull = ratio === 'full';
    const h = isFull ? container.scrollHeight + 100 : config.height;
    const sandbox = createSandbox(container, pages[i], config.width, h, i === 0);
    document.body.appendChild(sandbox);

    const canvas = await html2canvas(sandbox, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      onclone: (doc) => injectStylesInClone(doc, container)
    });

    document.body.removeChild(sandbox);
    const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), 'image/png'));
    blobs.push(blob);
  }
  return blobs;
};

/**
 * 导出单张图片（处理 App.tsx 的调用）
 */
export const downloadSingleImage = async (container: HTMLElement, ratio: ExportRatio) => {
  const blobs = await generateSplitImages(container, ratio);
  if (blobs.length > 0) {
    const url = URL.createObjectURL(blobs[0]);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-card-full.png`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

/**
 * 导出所有分割图片
 */
export const downloadAllSplitImages = async (container: HTMLElement, ratio: ExportRatio, title: string = 'chat-card') => {
  const blobs = await generateSplitImages(container, ratio);
  for (let i = 0; i < blobs.length; i++) {
    const url = URL.createObjectURL(blobs[i]);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_${i + 1}.png`;
    a.click();
    // 短暂延迟防止触发浏览器下载拦截
    await new Promise(res => setTimeout(res, 300));
    URL.revokeObjectURL(url);
  }
};