/**
 * 对话项类型
 */
export interface DialogueItem {
  role: 'user' | 'assistant';
  text: string;
}

/**
 * AI 转换结果
 */
export interface AITransformResult {
  title: string;
  content: DialogueItem[];
}
