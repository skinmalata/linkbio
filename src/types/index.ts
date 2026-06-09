export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  image?: string;
  username: string;
  bio?: string;
  theme: string;
  isPro: boolean;
  createdAt: string;
}

export interface Link {
  linkId: string;
  userId: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  clicks: number;
  createdAt: string;
}

export interface ClickEvent {
  linkId: string;
  timestamp: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
}

export interface ThemeConfig {
  background: string;
  cardStyle: string;
  textColor: string;
  buttonStyle: string;
  font: string;
}
