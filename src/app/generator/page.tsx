'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGeneration } from '@/context/GenerationContext';
import GeneratorScreen from '@/components/GeneratorScreen';
import SkeletonLoader from '@/components/SkeletonLoader';
import type { AspectRatio, Resolution, UploadedImage } from '@/types';

const motionPage = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.2, ease: 'easeInOut' as const },
};

export default function GeneratorPage() {
  const router = useRouter();
  const { state, generate } = useGeneration();

  const handleGenerate = async (
    prompt: string,
    aspectRatio: AspectRatio,
    resolution: Resolution,
    images: UploadedImage[],
  ) => {
    await generate(prompt, aspectRatio, resolution, images);
    router.push('/result');
  };

  return (
    <>
      {state.status === 'loading' ? (
        <motion.div key="generating" {...motionPage}>
          <SkeletonLoader />
        </motion.div>
      ) : (
        <motion.div key="generator" {...motionPage}>
          <GeneratorScreen
            onClose={() => router.push('/')}
            onGenerate={handleGenerate}
            isLoading={state.status === 'loading'}
          />
        </motion.div>
      )}
    </>
  );
}
