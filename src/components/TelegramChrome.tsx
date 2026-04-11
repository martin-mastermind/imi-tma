'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type TgWebApp = {
  expand?: () => void;
  ready?: () => void;
  BackButton?: {
    hide?: () => void;
    show?: () => void;
    onClick?: (cb: () => void) => void;
  };
};

function getTelegramWebApp(): TgWebApp | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp;
}

export default function TelegramChrome() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const tg = getTelegramWebApp();
    tg?.expand?.();
    tg?.ready?.();
  }, []);

  useEffect(() => {
    const tg = getTelegramWebApp();
    const back = tg?.BackButton;
    if (!back) return;

    if (pathname === '/') {
      back.hide?.();
      return;
    }

    back.show?.();
    const goBack = () => {
      if (pathname === '/result') router.push('/generator');
      else if (pathname === '/generator') router.push('/');
      else router.back();
    };
    back.onClick?.(goBack);
  }, [pathname, router]);

  return null;
}
