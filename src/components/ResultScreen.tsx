'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ResultScreenProps {
  variant: 'success' | 'error';
  imageUrl?: string;
  error?: string;
  failCode?: string | null;
  failMsg?: string | null;
  onBack: () => void;
  onReset: () => void;
}

export default function ResultScreen({
  variant,
  imageUrl,
  error,
  failCode,
  failMsg,
  onBack,
  onReset,
}: ResultScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'imi-generated.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (!imageUrl) return;
    try {
      const proxy = `/api/fetch-image?url=${encodeURIComponent(imageUrl)}`;
      const res = await fetch(proxy);
      if (res.ok) {
        const blob = await res.blob();
        const type =
          blob.type && blob.type !== 'application/octet-stream'
            ? blob.type
            : 'image/jpeg';
        await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      /* try text fallback */
    }

    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Не удалось скопировать изображение');
    }
  };

  if (variant === 'error') {
    const primary =
      (typeof failMsg === 'string' && failMsg.trim()) ||
      error ||
      'Не удалось создать изображение';

    return (
      <motion.div
        className="bg-bg-main min-h-screen relative flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-white font-norms text-[18px] leading-relaxed mb-2">{primary}</p>
          {failCode != null && String(failCode).trim() !== '' && (
            <p className="text-text-muted text-[14px] font-mono mt-2">
              Код: {String(failCode)}
            </p>
          )}
        </div>

        <div className="bg-gradient-to-t from-black/80 to-transparent pt-10 pb-8 px-4">
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={onBack}
              className="flex-1 h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium"
              whileTap={{ scale: 0.97 }}
            >
              Назад
            </motion.button>
            <motion.button
              type="button"
              onClick={onReset}
              className="flex-1 h-[48px] bg-blue-accent text-white rounded-[12px] font-norms font-bold"
              whileTap={{ scale: 0.97 }}
            >
              На главную
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!imageUrl) {
    return (
      <motion.div
        className="bg-bg-main min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-text-muted text-center">Нет изображения</p>
        <div className="fixed bottom-8 left-4 right-4">
          <motion.button
            type="button"
            onClick={onBack}
            className="w-full h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium"
            whileTap={{ scale: 0.97 }}
          >
            Назад
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-bg-main min-h-screen relative flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 relative">
        <Image src={imageUrl} alt="Generated" fill className="object-contain" unoptimized />
      </div>

      <div className="bg-gradient-to-t from-black/80 to-transparent pt-10 pb-8 px-4">
        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={onBack}
            className="flex-1 h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium"
            whileTap={{ scale: 0.97 }}
          >
            Назад
          </motion.button>
          <motion.button
            type="button"
            onClick={handleSave}
            className="flex-1 h-[48px] bg-blue-accent text-white rounded-[12px] font-norms font-bold"
            whileTap={{ scale: 0.97 }}
          >
            Сохранить
          </motion.button>
          <motion.button
            type="button"
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
