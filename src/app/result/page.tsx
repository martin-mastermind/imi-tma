'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGeneration } from '@/context/GenerationContext';
import ResultScreen from '@/components/ResultScreen';
import { PAGE_TRANSITION } from '@/constants';

export default function ResultPage() {
  const router = useRouter();
  const { state, reset } = useGeneration();

  useEffect(() => {
    if (state.status === 'idle' || state.status === 'loading') {
      router.replace('/');
    }
  }, [state.status, router]);

  if (state.status !== 'success' && state.status !== 'error') {
    return (
      <div className="bg-bg-main min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-[14px] font-norms">Загрузка…</p>
      </div>
    );
  }

  return (
    <motion.div key="result" {...PAGE_TRANSITION}>
      <ResultScreen
        variant={state.status === 'success' ? 'success' : 'error'}
        imageUrl={state.imageUrl}
        error={state.error}
        failCode={state.failCode}
        failMsg={state.failMsg}
        onBack={() => router.push('/generator')}
        onReset={() => {
          reset();
          router.push('/');
        }}
      />
    </motion.div>
  );
}
