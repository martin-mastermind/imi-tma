'use client';
import { useState, useCallback, useEffect } from 'react';
import type { Screen } from '@/types';

export function useNavigation() {
  const [screen, setScreen] = useState<Screen>('home');
  const [history, setHistory] = useState<Screen[]>([]);

  const goTo = useCallback((next: Screen) => {
    setHistory(h => [...h, screen]);
    setScreen(next);
  }, [screen]);

  const goBack = useCallback(() => {
    setHistory(h => {
      const prev = h[h.length - 1];
      if (prev) setScreen(prev);
      return h.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;
    if (screen === 'home') {
      tg.BackButton?.hide?.();
    } else {
      tg.BackButton?.show?.();
      tg.BackButton?.onClick?.(goBack);
    }
  }, [screen, goBack]);

  return { screen, goTo, goBack };
}
