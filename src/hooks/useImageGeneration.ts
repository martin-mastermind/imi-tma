'use client';
import { useState, useCallback } from 'react';
import type { GenerationState, AspectRatio, Resolution, UploadedImage } from '@/types';
import { createTask, pollJobStatus } from '@/services/imageService';

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
      const imageInputs = images.map(img => img.dataUrl);

      // Construct callback URL
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const callBackUrl = `${origin}/api/callback`;

      const taskId = await createTask(prompt, aspectRatio, resolution, imageInputs, callBackUrl);
      const imageUrl = await pollJobStatus(taskId);
      setState({ status: 'success', imageUrl });
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, generate, reset };
}
