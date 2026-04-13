'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGeneration } from '@/context/GenerationContext';
import GeneratorScreen from '@/components/GeneratorScreen';
import SkeletonLoader from '@/components/SkeletonLoader';
import { PAGE_TRANSITION } from '@/constants';
import type { AspectRatio, Resolution, UploadedImage } from '@/types';

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
        <motion.div key="generating" {...PAGE_TRANSITION}>
          <SkeletonLoader />
        </motion.div>
      ) : (
        <motion.div key="generator" {...PAGE_TRANSITION}>
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
