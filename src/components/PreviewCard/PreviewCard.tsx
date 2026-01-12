import { DialogueItem } from '@/types/dialogue';

interface PreviewCardProps {
  title: string;
  dialogueItems: DialogueItem[];
}

export const PreviewCard = ({ title, dialogueItems }: PreviewCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {dialogueItems.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              item.role === 'user'
                ? 'bg-blue-100 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            <div className="text-sm font-semibold mb-1">
              {item.role === 'user' ? '👤 用户' : '🤖 AI'}
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
