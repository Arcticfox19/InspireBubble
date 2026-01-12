/**
 * 卡片尺寸配置
 */
export const CARD_SIZES = {
  '3:4': {
    width: 1080,
    height: 1440,
    ratio: 3 / 4,
  },
  '9:16': {
    width: 1080,
    height: 1920,
    ratio: 9 / 16,
  },
} as const;

/**
 * 每张卡片最大对话轮数（估算）
 */
export const MAX_DIALOGUE_ROUNDS = {
  '3:4': 6,
  '9:16': 8,
} as const;
