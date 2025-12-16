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

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}