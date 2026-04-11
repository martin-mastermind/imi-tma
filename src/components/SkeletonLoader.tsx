'use client';
import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      {/* Header Skeleton */}
      <div className="h-[56px] bg-[#1e1f23] rounded-b-[12px] animate-pulse mt-4 mx-4" />

      {/* Main Skeleton Block */}
      <motion.div
        className="flex-1 mx-4 mt-4 rounded-[20px] bg-[#1e1f23]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Loading Text */}
      <div className="text-center py-6">
        <p className="text-text-muted text-[14px] font-norms">Генерируем изображение...</p>
        <div className="flex justify-center gap-1 mt-3">
          <motion.div className="w-2 h-2 rounded-full bg-blue-accent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <motion.div className="w-2 h-2 rounded-full bg-blue-accent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} />
          <motion.div className="w-2 h-2 rounded-full bg-blue-accent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
        </div>
      </div>
    </div>
  );
}
