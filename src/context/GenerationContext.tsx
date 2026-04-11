'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useImageGeneration } from '@/hooks/useImageGeneration';

type GenerationContextValue = ReturnType<typeof useImageGeneration>;

const GenerationContext = createContext<GenerationContextValue | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const value = useImageGeneration();
  return (
    <GenerationContext.Provider value={value}>{children}</GenerationContext.Provider>
  );
}

export function useGeneration() {
  const ctx = useContext(GenerationContext);
  if (!ctx) {
    throw new Error('useGeneration must be used within GenerationProvider');
  }
  return ctx;
}
