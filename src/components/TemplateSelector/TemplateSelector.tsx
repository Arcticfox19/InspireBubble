import { CardSize } from '@/types/template';

interface TemplateSelectorProps {
  selectedSize: CardSize;
  onSizeChange: (size: CardSize) => void;
}

export const TemplateSelector = ({ selectedSize, onSizeChange }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        卡片尺寸
      </label>
      <div className="flex gap-4">
        <button
          onClick={() => onSizeChange('3:4')}
          className={`px-6 py-3 rounded-lg border-2 transition-all ${
            selectedSize === '3:4'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="font-semibold">3:4 竖版</div>
          <div className="text-sm text-gray-600">1080 × 1440px</div>
        </button>
        <button
          onClick={() => onSizeChange('9:16')}
          className={`px-6 py-3 rounded-lg border-2 transition-all ${
            selectedSize === '9:16'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="font-semibold">9:16 竖版</div>
          <div className="text-sm text-gray-600">1080 × 1920px</div>
        </button>
      </div>
    </div>
  );
};
