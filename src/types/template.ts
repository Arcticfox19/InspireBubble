import type { ComponentType } from 'react';
import type { DialogueItem } from './dialogue';

/**
 * 卡片尺寸类型
 */
export type CardSize = '3:4' | '9:16';

/**
 * 模板属性
 */
export interface TemplateProps {
  title: string;
  dialogueItems: DialogueItem[];
  cardSize: CardSize;
  cardIndex: number;
  totalCards: number;
}

/**
 * 模板接口
 */
export interface ITemplate {
  name: string;
  displayName: string;
  component: ComponentType<TemplateProps>;
  preview?: string; // 预览图 URL
}
