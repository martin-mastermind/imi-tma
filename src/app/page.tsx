'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import HomeScreen from '@/components/HomeScreen';
import { PAGE_TRANSITION } from '@/constants';

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.div key="home" {...PAGE_TRANSITION}>
      <HomeScreen onNavigateToGenerator={() => router.push('/generator')} />
    </motion.div>
  );
}
