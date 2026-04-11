'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import HomeScreen from '@/components/HomeScreen';

const motionPage = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.2, ease: 'easeInOut' as const },
};

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.div key="home" {...motionPage}>
      <HomeScreen onNavigateToGenerator={() => router.push('/generator')} />
    </motion.div>
  );
}
