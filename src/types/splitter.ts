import { DialogueItem } from './dialogue';
import { CardSize } from './template';

/**
 * 卡片内容
 */
export interface CardContent {
  dialogueItems: DialogueItem[];
  cardIndex: number;
  totalCards: number;
}

export type { CardSize };
