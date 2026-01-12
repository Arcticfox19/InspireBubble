import { useState, useRef, useEffect } from 'react';
import { DialogueItem } from '@/types/dialogue';
import { ExportRatio } from '@/types/export';
import { calculatePageBreaks } from '@/core/generator/wysiwyg-generator cp';
import './WysiwygPreview.css';

interface WysiwygPreviewProps {
  title: string;
  dialogueItems: DialogueItem[];
  onTitleChange: (title: string) => void;
  onDialogueChange: (items: DialogueItem[]) => void;
  exportRatio: ExportRatio;
}

export const WysiwygPreview = ({
  title,
  dialogueItems,
  onTitleChange,
  onDialogueChange,
  exportRatio,
}: WysiwygPreviewProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);

  // 计算分页位置
  useEffect(() => {
    if (cardRef.current && dialogueItems.length > 0) {
      // 延迟计算，确保DOM已渲染
      const timer = setTimeout(() => {
        try {
          const breaks = calculatePageBreaks(cardRef.current!, exportRatio);
          setPageBreaks(breaks);
        } catch (error) {
          console.error('计算分页位置失败:', error);
          setPageBreaks([]);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setPageBreaks([]);
    }
  }, [dialogueItems, exportRatio, title]);

  const handleBubbleClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleBubbleBlur = (index: number, newText: string) => {
    const newItems = [...dialogueItems];
    newItems[index].text = newText;
    onDialogueChange(newItems);
    setEditingIndex(null);
  };

  const handleTitleClick = () => {
    setEditingTitle(true);
  };

  const handleTitleBlur = (newTitle: string) => {
    onTitleChange(newTitle);
    setEditingTitle(false);
  };

  return (
    <div className="wysiwyg-preview-container" ref={containerRef}>
      <div className="wysiwyg-preview-card" ref={cardRef}>
        {/* 标题区域 */}
        <div className="wysiwyg-title-wrapper">
          {editingTitle ? (
            <input
              type="text"
              className="wysiwyg-title-input"
              defaultValue={title}
              autoFocus
              onBlur={(e) => handleTitleBlur(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
            />
          ) : (
            <h1 className="wysiwyg-title" onClick={handleTitleClick}>
              {title || '点击编辑标题'}
            </h1>
          )}
        </div>

        {/* 分页辅助线 */}
        {pageBreaks.length > 1 && pageBreaks.slice(1, -1).map((breakY, index) => (
          <div
            key={`break-${index}`}
            className="wysiwyg-page-break-line"
            style={{
              top: `${breakY}px`,
            }}
          />
        ))}

        {/* 对话列表 */}
        <div className="wysiwyg-message-list">
          {dialogueItems.map((item, index) => (
            <div
              key={index}
              className={`wysiwyg-message wysiwyg-message-${item.role}`}
            >
              {/* 头像 */}
              <div className="wysiwyg-avatar">
                {item.role === 'user' ? 'ME' : 'AI'}
              </div>

              {/* 气泡内容 */}
              {editingIndex === index ? (
                <textarea
                  className="wysiwyg-bubble-edit"
                  defaultValue={item.text}
                  autoFocus
                  onBlur={(e) => handleBubbleBlur(index, e.target.value)}
                  style={{
                    background:
                      item.role === 'user'
                        ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                        : 'rgba(255, 255, 255, 0.85)',
                    color: item.role === 'user' ? '#ffffff' : '#1e293b',
                  }}
                />
              ) : (
                <div
                  className="wysiwyg-bubble"
                  onClick={() => handleBubbleClick(index)}
                  style={{
                    background:
                      item.role === 'user'
                        ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                        : 'rgba(255, 255, 255, 0.85)',
                    color: item.role === 'user' ? '#ffffff' : '#1e293b',
                    cursor: 'text',
                  }}
                >
                  {item.text || '点击编辑内容'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部装饰 */}
        <div className="wysiwyg-footer-hint">AI NOTE GENERATOR</div>
      </div>
    </div>
  );
};
