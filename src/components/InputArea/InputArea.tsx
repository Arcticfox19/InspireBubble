import { useState, useEffect } from 'react';
import { saveInputContent, getInputContent } from '@/utils/storage';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const InputArea = ({ value, onChange, placeholder = '粘贴 AI 对话记录或输入内容...' }: InputAreaProps) => {
  const [localValue, setLocalValue] = useState(value);

  // 从 localStorage 恢复内容
  useEffect(() => {
    const saved = getInputContent();
    if (saved && !value) {
      setLocalValue(saved);
      onChange(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
    saveInputContent(newValue);
  };

  return (
    <div className="w-full">
      <textarea
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="mt-2 text-sm text-gray-500 text-right">
        {localValue.length} 字符
      </div>
    </div>
  );
};
