'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <div className="bg-bg-main min-h-screen flex flex-col text-text-light">
      <div className="bg-bg-main h-[40px] pt-4 flex items-center gap-2 px-4 shrink-0">
        <Image src="/icons/icon-photo.svg" alt="" width={14} height={14} />
        <span className="text-text-muted text-[16px] font-norms font-medium leading-[24px]">
          Создание изображений
        </span>
        <Image src="/icons/icon-chevron.svg" alt="" width={16} height={16} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-24">
        <div className="w-full max-w-[280px] h-[3px] rounded-full bg-[#2a2b2e] overflow-hidden mb-6">
          <motion.div
            className="h-full w-[40%] rounded-full bg-blue-accent"
            animate={{ x: ['-30%', '230%'] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <p className="font-machina text-[22px] text-white text-center leading-tight mb-2">
          Создаём изображение
        </p>
        <p className="text-text-muted text-[15px] font-norms text-center leading-relaxed max-w-[300px]">
          Обычно около минуты. Дождитесь перехода на экран с результатом.
        </p>
      </div>
    </div>
  );
}
