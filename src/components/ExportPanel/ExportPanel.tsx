import { ExportRatio, EXPORT_RATIOS } from '@/types/export';

interface ExportPanelProps {
  selectedRatio: ExportRatio;
  onRatioChange: (ratio: ExportRatio) => void;
  onExportSingle?: () => void;
  onExportAll?: () => void;
  isLoading?: boolean;
}

export const ExportPanel = ({
  selectedRatio,
  onRatioChange,
  onExportSingle,
  onExportAll,
  isLoading,
}: ExportPanelProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">3. 导出设置</h3>
      
      {/* 比例选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          导出比例
        </label>
        <div className="flex flex-col gap-2">
          {Object.entries(EXPORT_RATIOS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onRatioChange(key as ExportRatio)}
              className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                selectedRatio === key
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">{config.label}</div>
              {config.height !== Infinity && (
                <div className="text-sm text-gray-600">
                  {config.width} × {config.height}px
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 导出按钮 */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={onExportSingle}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {isLoading ? '生成中...' : '导出单张'}
        </button>
        <button
          onClick={onExportAll}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? '生成中...' : '导出全部 (ZIP)'}
        </button>
      </div>
    </div>
  );
};
