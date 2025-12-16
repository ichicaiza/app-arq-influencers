export interface InfluencerParams {
  sexAge: string;
  physique: string;
  hair: string;
  extras: string;
  clothing: string;
  environment: string;
  action: string;
  style: string;
}

export interface PromptOutput {
  fullBody: string;
  extremeCloseUp: string;
  viewFromBehind: string;
  sideProfile: string;
  actionShot: string;
}

export interface GeneratedImage {
  prompt: string;
  imageData: string | null; // Base64 string
  aspectRatio: string;
}

export interface ImageGenerationResult {
  fullBody: GeneratedImage;
  extremeCloseUp: GeneratedImage;
  viewFromBehind: GeneratedImage;
  sideProfile: GeneratedImage;
  actionShot: GeneratedImage;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}