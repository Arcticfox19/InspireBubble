/**
 * AI 服务相关类型定义
 */

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GenerateOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
