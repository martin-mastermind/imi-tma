'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ResultScreenProps {
  imageUrl: string;
  onBack: () => void;
  onReset: () => void;
}

export default function ResultScreen({ imageUrl, onBack, onReset }: ResultScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'imi-generated.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/jpeg': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Copy failed');
    }
  };

  return (
    <motion.div
      className="bg-black min-h-screen relative flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="flex-1 relative">
        <Image src={imageUrl} alt="Generated" fill className="object-contain" />
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-gradient-to-t from-black/80 to-transparent pt-10 pb-8 px-4">
        <div className="flex gap-3">
          <motion.button
            onClick={onBack}
            className="flex-1 h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium"
            whileTap={{ scale: 0.97 }}
          >
            Назад
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="flex-1 h-[48px] bg-blue-accent text-white rounded-[12px] font-norms font-bold"
            whileTap={{ scale: 0.97 }}
          >
            Сохранить
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="flex-1 h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium relative"
            whileTap={{ scale: 0.97 }}
          >
            {copied ? '✓ Скопировано' : 'Копировать'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
