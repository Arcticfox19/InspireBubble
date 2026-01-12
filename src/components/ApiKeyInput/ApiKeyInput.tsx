import { useState, useEffect } from 'react';
import { getApiKey, saveApiKey, clearApiKey } from '@/utils/storage';

interface ApiKeyInputProps {
  onKeyChange?: (key: string) => void;
}

export const ApiKeyInput = ({ onKeyChange }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const saved = getApiKey();
    if (saved) {
      setApiKey(saved);
      onKeyChange?.(saved);
    }
  }, [onKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setIsEditing(false);
      onKeyChange?.(apiKey.trim());
    }
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setIsEditing(false);
    onKeyChange?.('');
  };

  const currentKey = getApiKey();

  if (!isEditing && currentKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">API Key 已设置</span>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
        >
          修改
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
        >
          清除
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Gemini API Key
      </label>
      <div className="flex gap-2">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="输入您的 Gemini API Key"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowKey(!showKey)}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          {showKey ? '隐藏' : '显示'}
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          保存
        </button>
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setApiKey(getApiKey());
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            取消
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        如果未设置，将使用环境变量中的默认 Key（如果有）
      </p>
    </div>
  );
};
