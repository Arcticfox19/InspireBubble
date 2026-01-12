import { useState, useCallback } from 'react';
import { DialogueItem } from '@/types/dialogue';
import { CardSize } from '@/types/template';
import { downloadSingleImage, downloadAllImages } from '@/core/generator/image-generator';

interface UseImageGeneratorReturn {
  generating: boolean;
  error: string | null;
  generateSingle: (title: string, items: DialogueItem[], cardSize: CardSize, cardIndex?: number) => Promise<void>;
  generateAll: (title: string, items: DialogueItem[], cardSize: CardSize) => Promise<void>;
  reset: () => void;
}

/**
 * 图片生成 Hook
 */
export const useImageGenerator = (): UseImageGeneratorReturn => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSingle = useCallback(async (
    title: string,
    items: DialogueItem[],
    cardSize: CardSize,
    cardIndex: number = 0
  ) => {
    setGenerating(true);
    setError(null);

    try {
      await downloadSingleImage(title, items, cardSize, cardIndex);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '图片生成失败';
      setError(errorMessage);
      console.error('Image generation error:', err);
    } finally {
      setGenerating(false);
    }
  }, []);

  const generateAll = useCallback(async (
    title: string,
    items: DialogueItem[],
    cardSize: CardSize
  ) => {
    setGenerating(true);
    setError(null);

    try {
      await downloadAllImages(title, items, cardSize);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '图片生成失败';
      setError(errorMessage);
      console.error('Image generation error:', err);
    } finally {
      setGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    generating,
    error,
    generateSingle,
    generateAll,
    reset,
  };
};
