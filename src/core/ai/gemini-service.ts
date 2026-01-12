import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from '@/utils/storage';

let genAI: GoogleGenerativeAI | null = null;

/**
 * 初始化 Gemini 客户端
 */
const initGemini = (apiKey: string): GoogleGenerativeAI => {
  // 每次重新创建实例以确保使用正确的 API Key
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

/**
 * 调用 Gemini API 生成文本
 */
export const generateText = async (
  prompt: string,
  apiKey?: string
): Promise<string> => {
  const key = apiKey || getApiKey();
  
  if (!key) {
    throw new Error('API Key 未设置，请在设置中输入您的 Gemini API Key');
  }

  try {
    const genAI = initGemini(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    if (error instanceof Error) {
      // 处理常见错误
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('API Key 无效，请检查您的 Gemini API Key');
      }
      if (error.message.includes('QUOTA')) {
        throw new Error('API 配额已用完，请稍后再试或检查您的配额');
      }
      throw new Error(`API 调用失败: ${error.message}`);
    }
    throw new Error('未知错误，请稍后重试');
  }
};

/**
 * 提取 JSON 内容（处理可能的 Markdown 代码块标记）
 */
export const extractJSON = (text: string): string => {
  // 尝试提取 JSON 部分
  // 如果被 ```json ... ``` 包裹，提取内容
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  
  // 尝试找到 JSON 对象的开始和结束
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return text.substring(jsonStart, jsonEnd + 1);
  }
  
  // 如果都没有，返回原文
  return text.trim();
};
