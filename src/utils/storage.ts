/**
 * localStorage 键名
 */
export const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gemini_api_key',
  INPUT_CONTENT: 'input_content',
} as const;

/**
 * API Key 管理器
 */
export const getApiKey = (): string => {
  // 1. 优先使用用户输入的 Key（localStorage）
  const userKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
  if (userKey) return userKey;
  
  // 2. 使用环境变量（开发/默认）
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  
  // 3. 返回空字符串，提示用户输入
  return '';
};

/**
 * 保存 API Key
 */
export const saveApiKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key);
};

/**
 * 清除 API Key
 */
export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
};

/**
 * 保存输入内容
 */
export const saveInputContent = (content: string): void => {
  localStorage.setItem(STORAGE_KEYS.INPUT_CONTENT, content);
};

/**
 * 获取输入内容
 */
export const getInputContent = (): string => {
  return localStorage.getItem(STORAGE_KEYS.INPUT_CONTENT) || '';
};
