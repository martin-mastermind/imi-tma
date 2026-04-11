export type Screen = 'home' | 'generator' | 'result';
export type AspectRatio = '1:1' | '1:4' | '1:8' | '2:3' | '3:2' | '3:4' | '4:1' | '4:3' | '4:5' | '5:4' | '8:1' | '9:16' | '16:9' | '21:9' | 'auto';
export type Resolution = '1K' | '2K' | '4K';

export interface UploadedImage {
  id: string;
  dataUrl: string;
  label?: string;
  isTemplate?: boolean;
}

export interface GenerationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  imageUrl?: string;
  error?: string;
  failCode?: string | null;
  failMsg?: string | null;
}
