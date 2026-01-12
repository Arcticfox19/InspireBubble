import { DialogueItem } from '@/types/dialogue';

interface DialogueEditorProps {
  title: string;
  dialogueItems: DialogueItem[];
  onTitleChange: (title: string) => void;
  onDialogueChange: (items: DialogueItem[]) => void;
}

export const DialogueEditor = ({
  title,
  dialogueItems,
  onTitleChange,
  onDialogueChange,
}: DialogueEditorProps) => {
  const handleEditItem = (index: number, newText: string) => {
    const newItems = [...dialogueItems];
    newItems[index].text = newText;
    onDialogueChange(newItems);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = dialogueItems.filter((_, i) => i !== index);
    onDialogueChange(newItems);
  };

  const handleAddItem = (index: number, role: 'user' | 'assistant') => {
    const newItems = [...dialogueItems];
    newItems.splice(index + 1, 0, { role, text: '' });
    onDialogueChange(newItems);
  };

  const handleToggleRole = (index: number) => {
    const newItems = [...dialogueItems];
    newItems[index].role = newItems[index].role === 'user' ? 'assistant' : 'user';
    onDialogueChange(newItems);
  };

  return (
    <div className="space-y-4">
      {/* 标题编辑 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入标题..."
        />
      </div>

      {/* 对话列表 */}
      <div className="space-y-3">
        {dialogueItems.map((item, index) => (
          <div
            key={index}
            className={`group relative p-4 rounded-lg border-2 ${
              item.role === 'user'
                ? 'bg-blue-50 border-blue-200 ml-8'
                : 'bg-gray-50 border-gray-200 mr-8'
            }`}
          >
            {/* 操作按钮 */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleToggleRole(index)}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="切换角色"
              >
                {item.role === 'user' ? '👤' : '🤖'}
              </button>
              <button
                onClick={() => handleAddItem(index, 'user')}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                title="在下方添加用户消息"
              >
                +用户
              </button>
              <button
                onClick={() => handleAddItem(index, 'assistant')}
                className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                title="在下方添加AI消息"
              >
                +AI
              </button>
              <button
                onClick={() => handleDeleteItem(index)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                title="删除"
              >
                删除
              </button>
            </div>

            {/* 内容编辑 */}
            <textarea
              value={item.text}
              onChange={(e) => handleEditItem(index, e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder={item.role === 'user' ? '输入用户消息...' : '输入AI回复...'}
            />
          </div>
        ))}
      </div>

      {/* 添加新消息按钮 */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => handleAddItem(dialogueItems.length - 1, 'user')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + 添加用户消息
        </button>
        <button
          onClick={() => handleAddItem(dialogueItems.length - 1, 'assistant')}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          + 添加AI消息
        </button>
      </div>
    </div>
  );
};
