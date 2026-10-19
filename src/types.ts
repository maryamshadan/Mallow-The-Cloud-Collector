export type ThemeMode = 'day' | 'sunset' | 'night';

export type MallowMood =
  | 'happy'
  | 'excited'
  | 'shy'
  | 'sleepy'
  | 'curious'
  | 'surprised'
  | 'giggling'
  | 'laughing'
  | 'comforting'
  | 'content'
  | 'winking'
  | 'dreamy';

export interface DreamPillow {
  id: string;
  name: string;
  density: string;
  theme: string;
  fabric: string;
  softness: number;
  fragrance: string;
  createdAt: string;
  color: string;
  essenceIcon?: string;
}

export interface DreamForecast {
  id: string;
  title: string;
  description: string;
  probability: string;
  cloudCover: string;
  temperature: string;
  windSpeed: string;
  recommendedActivity: string;
  luckyToken: string;
  accentColor: string;
  iconName: string;
}

export type RainPreset = 'gentle' | 'window' | 'downpour' | 'mist';

export interface CollectedDream {
  id: string;
  title: string;
  description: string;
  essence: string;
  essenceColor: string;
  createdAt: string;
  tuckedInPillow?: boolean;
}

export interface SkyWish {
  id: string;
  nickname: string;
  message: string;
  token: 'star' | 'moon' | 'heart' | 'cloud' | 'flower' | 'sparkle';
  color: string;
  x: number;
  y: number;
  timestamp: string;
  likes: number;
}

export interface VisitorMemory {
  nickname: string;
  hasVisitedBefore: boolean;
  visitCount: number;
  firstVisitTime: string;
  lastVisitTime: string;
  lastExperience?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mallow';
  text: string;
  timestamp: string;
  mood?: MallowMood;
}
