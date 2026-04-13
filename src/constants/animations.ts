export const PAGE_TRANSITION = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.2, ease: 'easeInOut' as const },
};

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

export const SCALE_TAP = (scale = 0.95) => ({ scale });
