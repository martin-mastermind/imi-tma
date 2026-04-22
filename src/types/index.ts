
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
