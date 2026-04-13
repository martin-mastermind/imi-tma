"use client";

import { motion } from "framer-motion";

const TITLE_ID = "generation-wait-title";

export default function GenerationWaitOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-6"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-labelledby={TITLE_ID}
    >
      <div className="w-full max-w-[320px] rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#141415] px-6 py-8 shadow-lg">
        <div className="mb-6 h-[3px] w-full overflow-hidden rounded-full bg-[#2a2b2e]">
          <motion.div
            className="h-full w-[40%] rounded-full bg-blue-accent"
            animate={{ x: ["-30%", "230%"] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <h2
          id={TITLE_ID}
          className="font-machina text-center text-[20px] leading-tight text-white mb-2"
        >
          Идёт генерация
        </h2>
        <p className="text-center text-[15px] font-norms leading-relaxed text-text-muted">
          Обычно около минуты. Дождитесь перехода на экран с результатом.
        </p>
      </div>
    </div>
  );
}
