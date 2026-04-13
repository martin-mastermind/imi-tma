"use client";

import dynamic from "next/dynamic";
import { GenerationProvider } from "@/context/GenerationContext";

const TelegramChrome = dynamic(() => import("@/components/TelegramChrome"), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GenerationProvider>
      <TelegramChrome />
      {children}
    </GenerationProvider>
  );
}
