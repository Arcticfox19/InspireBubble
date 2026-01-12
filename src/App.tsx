import { useState, useEffect, useRef } from 'react';
import { InputArea } from './components/InputArea/InputArea';
import { ApiKeyInput } from './components/ApiKeyInput/ApiKeyInput';
import { WysiwygPreview } from './components/WysiwygPreview/WysiwygPreview';
import { ExportPanel } from './components/ExportPanel/ExportPanel';
import { DialogueItem } from './types/dialogue';
import { ExportRatio } from './types/export';
import { useGemini } from './hooks/useGemini';
import { downloadSingleImage, downloadAllSplitImages } from './core/generator/wysiwyg-generator cp';

function App() {
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [exportRatio, setExportRatio] = useState<ExportRatio>('3:4');
  
  // AI 转换相关
  const { loading, error, result, transform, reset: resetGemini } = useGemini();
  
  // 编辑状态
  const [editableTitle, setEditableTitle] = useState('点击编辑标题');
  const [editableItems, setEditableItems] = useState<DialogueItem[]>([]);
  const [exporting, setExporting] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // 当 AI 转换成功时，更新可编辑内容
  useEffect(() => {
    if (result) {
      setEditableTitle(result.title);
      setEditableItems(result.content);
    }
  }, [result]);

  const handleTransform = async () => {
    if (!inputText.trim()) {
      alert('请输入内容');
      return;
    }
    resetGemini();
    await transform(inputText, apiKey || undefined);
  };


  const handleExportSingle = async () => {
    if (!previewContainerRef.current) {
      alert('预览容器未找到');
      return;
    }

    const cardElement = previewContainerRef.current.querySelector('.wysiwyg-preview-card') as HTMLElement;
    if (!cardElement) {
      alert('卡片元素未找到');
      return;
    }

    setExporting(true);
    try {
      await downloadSingleImage(cardElement, exportRatio);
    } catch (err) {
      console.error('导出失败:', err);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (!previewContainerRef.current) {
      alert('预览容器未找到');
      return;
    }

    const cardElement = previewContainerRef.current.querySelector('.wysiwyg-preview-card') as HTMLElement;
    if (!cardElement) {
      alert('卡片元素未找到');
      return;
    }

    setExporting(true);
    try {
      await downloadAllSplitImages(cardElement, exportRatio, editableTitle);
    } catch (err) {
      console.error('导出失败:', err);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          小红书排版工具
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">1. 输入内容</h2>
              <InputArea value={inputText} onChange={setInputText} />
              <button
                onClick={handleTransform}
                disabled={loading || !inputText.trim()}
                className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? '转换中...' : '转换为对话格式'}
              </button>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">API Key 设置</h2>
              <ApiKeyInput onKeyChange={setApiKey} />
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <ExportPanel
                selectedRatio={exportRatio}
                onRatioChange={setExportRatio}
                onExportSingle={handleExportSingle}
                onExportAll={handleExportAll}
                isLoading={exporting}
              />
            </div>
          </div>

          {/* 右侧：WYSIWYG 预览 */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">实时预览（点击编辑）</h2>
              <div ref={previewContainerRef}>
                {editableItems.length > 0 ? (
                  <WysiwygPreview
                    title={editableTitle}
                    dialogueItems={editableItems}
                    onTitleChange={setEditableTitle}
                    onDialogueChange={setEditableItems}
                    exportRatio={exportRatio}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p>输入内容并点击"转换为对话格式"开始编辑</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
