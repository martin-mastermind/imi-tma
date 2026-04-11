'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigation } from '@/hooks/useNavigation';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import HomeScreen from './HomeScreen';
import GeneratorScreen from './GeneratorScreen';
import ResultScreen from './ResultScreen';
import SkeletonLoader from './SkeletonLoader';
import type { AspectRatio, Resolution, UploadedImage } from '@/types';

export default function App() {
  const { screen, goTo, goBack } = useNavigation();
  const { state, generate, reset } = useImageGeneration();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp;
      tg?.expand?.();
      tg?.ready?.();
    }
  }, []);

  const handleGenerate = async (
    prompt: string,
    aspectRatio: AspectRatio,
    resolution: Resolution,
    images: UploadedImage[]
  ) => {
    await generate(prompt, aspectRatio, resolution, images);
    if (state.status === 'success') {
      goTo('result');
    }
  };

  const containerVariants = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { duration: 0.2, ease: 'easeInOut' },
  };

  return (
    <AnimatePresence mode="wait">
      {screen === 'home' && (
        <motion.div key="home" {...containerVariants}>
          <HomeScreen onNavigateToGenerator={() => goTo('generator')} />
        </motion.div>
      )}
      {screen === 'generator' && (
        <>
          {state.status === 'loading' ? (
            <motion.div key="skeleton" {...containerVariants}>
              <SkeletonLoader />
            </motion.div>
          ) : (
            <motion.div key="generator" {...containerVariants}>
              <GeneratorScreen
                onClose={goBack}
                onGenerate={handleGenerate}
                isLoading={state.status === 'loading'}
              />
            </motion.div>
          )}
        </>
      )}
      {screen === 'result' && state.imageUrl && (
        <motion.div key="result" {...containerVariants}>
          <ResultScreen
            imageUrl={state.imageUrl}
            onBack={goBack}
            onReset={() => {
              reset();
              goTo('home');
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
