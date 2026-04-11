'use client';

import { GenerationProvider } from '@/context/GenerationContext';
import TelegramChrome from '@/components/TelegramChrome';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GenerationProvider>
      <TelegramChrome />
      {children}
    </GenerationProvider>
  );
}
