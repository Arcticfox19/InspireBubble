import { useState, useCallback } from 'react';
import { transformToDialogue } from '@/core/transformer/dialogue-transformer';
import type { AITransformResult } from '@/types/dialogue';

interface UseGeminiReturn {
  loading: boolean;
  error: string | null;
  result: AITransformResult | null;
  transform: (inputText: string, apiKey?: string) => Promise<void>;
  reset: () => void;
}

/**
 * Gemini API Hook
 */
export const useGemini = (): UseGeminiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AITransformResult | null>(null);

  const transform = useCallback(async (inputText: string, apiKey?: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const transformed = await transformToDialogue(inputText, apiKey);
      setResult(transformed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '转换失败，请稍后重试';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    loading,
    error,
    result,
    transform,
    reset,
  };
};
