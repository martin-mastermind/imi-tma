'use client';
import { useState, useCallback } from 'react';
import type { GenerationState, AspectRatio, Resolution, UploadedImage } from '@/types';
import { createTask, KieJobFailedError, pollJobStatus } from '@/services/imageService';

function toAbsoluteImageUrl(url: string, origin: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  try {
    return new URL(url, origin).href;
  } catch {
    return url;
  }
}

export function useImageGeneration() {
  const [state, setState] = useState<GenerationState>({ status: 'idle' });

  const generate = useCallback(async (
    prompt: string,
    aspectRatio: AspectRatio,
    resolution: Resolution,
    images: UploadedImage[]
  ) => {
    setState({ status: 'loading' });
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const imageInputs = images
        .filter((img) => !img.isTemplate)
        .map((img) => toAbsoluteImageUrl(img.dataUrl, origin));

      const taskId = await createTask(prompt, aspectRatio, resolution, imageInputs);
      const imageUrl = await pollJobStatus(taskId);
      setState({ status: 'success', imageUrl });
    } catch (err) {
      if (err instanceof KieJobFailedError) {
        setState({
          status: 'error',
          error: err.message,
          failCode: err.failCode,
          failMsg: err.failMsg,
        });
      } else {
        setState({
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
          failCode: null,
          failMsg: null,
        });
      }
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, generate, reset };
}
