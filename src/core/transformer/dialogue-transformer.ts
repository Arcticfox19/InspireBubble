import { generateText, extractJSON } from '../ai/gemini-service';
import { buildPrompt } from '../ai/prompt-template';
import type { AITransformResult } from '@/types/dialogue';

/**
 * 将文本转换为对话格式
 */
export const transformToDialogue = async (
  inputText: string,
  apiKey?: string
): Promise<AITransformResult> => {
  if (!inputText.trim()) {
    throw new Error('输入内容不能为空');
  }

  try {
    // 构建 Prompt
    const prompt = buildPrompt(inputText);
    
    // 调用 AI 服务
    const rawResponse = await generateText(prompt, apiKey);
    
    // 提取 JSON
    const jsonString = extractJSON(rawResponse);
    
    // 解析 JSON
    let result: AITransformResult;
    try {
      result = JSON.parse(jsonString);
    } catch (parseError) {
      // 尝试修复常见的 JSON 错误
      const fixedJson = fixJSON(jsonString);
      result = JSON.parse(fixedJson);
    }
    
    // 验证结果格式
    validateResult(result);
    
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('转换失败，请稍后重试');
  }
};

/**
 * 修复常见的 JSON 格式错误
 */
const fixJSON = (json: string): string => {
  let fixed = json;
  
  // 修复单引号
  fixed = fixed.replace(/'/g, '"');
  
  // 修复尾随逗号
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  
  return fixed;
};

/**
 * 验证转换结果格式
 */
const validateResult = (result: any): void => {
  if (!result || typeof result !== 'object') {
    throw new Error('转换结果格式错误：不是有效的对象');
  }
  
  if (!result.title || typeof result.title !== 'string') {
    throw new Error('转换结果格式错误：缺少 title 字段');
  }
  
  if (!Array.isArray(result.content)) {
    throw new Error('转换结果格式错误：content 必须是数组');
  }
  
  for (const item of result.content) {
    if (!item.role || !['user', 'assistant'].includes(item.role)) {
      throw new Error('转换结果格式错误：content 中的 role 必须是 "user" 或 "assistant"');
    }
    if (!item.text || typeof item.text !== 'string') {
      throw new Error('转换结果格式错误：content 中的 text 必须是字符串');
    }
  }
};
