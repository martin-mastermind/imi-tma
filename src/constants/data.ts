import type { AspectRatio } from '@/types';

export const AGENTS = [
  {
    name: 'Сценарист Reels',
    url: '/images/agent-reels-scriptwriter.png',
  },
  {
    name: 'SMM-Менеджер',
    url: '/images/agent-smm-manager.png',
  },
  {
    name: 'ИИ-фотограф',
    url: '/images/agent-ai-photographer.png',
  },
  {
    name: 'Нейрофотограф',
    url: '/images/agent-neuro-photographer.png',
  },
];

export const HERO_CARDS = [
  {
    name: 'image-gen',
    title: 'Сгенерировать\nизображение',
    image: '/images/hero-image-generation.png',
    tags: [
      ['Banana Pro', 'Flux', 'Midjourney'],
      ['GPT Image', 'Seedream', 'Ideogram'],
    ],
    functional: true,
    bottom: 'bottom-[40px]',
  },
  {
    name: 'video-gen',
    title: 'Сгенерировать видео',
    image: '/images/hero-video-generation.png',
    tags: [['Kling', 'Veo3', 'Hailuo', 'Sora 2']],
  },
  {
    name: 'train',
    title: 'Натренировать\nмодель с помощью\nсвоих фотографий',
    image: '/images/hero-model-training.png',
    bottom: 'bottom-[51px]',
  },
  {
    name: 'process',
    title: 'Обработать фото',
    image: '/images/hero-photo-processing.png',
    height: 'h-[320px]',
    bottom: 'bottom-[46px]',
  },
];

export const HOME_TEMPLATES = [
  {
    label: 'Soft Roses',
    url: '/images/template-soft-roses-1.png',
  },
  {
    label: 'Soft Roses',
    url: '/images/template-soft-roses-2.png',
  },
  {
    label: 'Soft Roses',
    url: '/images/template-soft-roses-3.png',
  },
];

export const GENERATOR_TEMPLATES = [
  {
    name: 'Розовый портрет',
    url: '/images/template-pink-portrait.png',
    prompt: 'Розовый портрет в нежных тонах',
  },
  {
    name: 'В небоскребе среди цветов',
    url: '/images/template-skyscraper-flowers.png',
    prompt: 'Городской пейзаж с небоскребом в окружении цветов',
  },
  {
    name: 'Нежность',
    url: '/images/template-tenderness.png',
    prompt: 'Нежное и чувственное изображение',
  },
  {
    name: '8 марта в стиле',
    url: '/images/template-march-8-style.png',
    prompt: '8 марта, праздничный стиль с цветами',
  },
  {
    name: 'Море цветов',
    url: '/images/template-sea-flowers.png',
    prompt: 'Красивое море цветов',
  },
];

export const MODELS = ['Nano Banana Pro'];

export const ASPECT_RATIOS: AspectRatio[] = [
  '1:1',
  '4:3',
  '16:9',
  '9:16',
  '3:2',
  '2:3',
  '4:5',
  '5:4',
  '21:9',
];

export const RESOLUTIONS = ['1K', '2K', '4K'] as const;
