// src/plugin/types.ts

export type CardType = 'home' | 'popup';

export type ChatHistoryItem = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type HomeBannerAIResult = {
  image: { color: string };
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  caption?: string;
};

export type PopupAIResult = {
  imageColor: string;
  sub: string;
  title1: string;
  title2: string;
};
