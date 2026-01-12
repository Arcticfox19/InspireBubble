/**
 * 导出比例类型
 */
export type ExportRatio = 'full' | '3:4' | '16:9';

/**
 * 导出比例配置
 */
export const EXPORT_RATIOS = {
  full: {
    width: 375,
    height: Infinity, // 不分页，使用完整高度
    ratio: 0,
    label: '长图（不分页）',
  },
  '3:4': {
    width: 375,
    height: 500, // 375 * 4 / 3 = 500
    ratio: 3 / 4,
    label: '3:4 小红书竖屏',
  },
  '16:9': {
    width: 375,
    height: 667, // 375 * 16 / 9 ≈ 667
    ratio: 16 / 9,
    label: '16:9 抖音竖屏',
  },
} as const;
