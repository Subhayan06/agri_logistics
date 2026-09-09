export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'gu' | 'kn' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string; // e.g., "English", "বাংলা", "हिंदी"
  sublabel: string; // e.g. "English", "Bengali", "Hindi"
  speechCode: string; // Speech recognition language code e.g. "en-IN", "bn-IN"
}

export enum BotStep {
  STEP_0_LANGUAGE = 0,
  STEP_1_AGRISTACK = 1,
  STEP_2_CROP = 2,
  STEP_3_QUANTITY = 3,
  STEP_4_MANDI = 4,
  STEP_5_PASS_ISSUED = 5,
}

export interface GatePassData {
  passCode: string; // e.g. KQ-7842-WB
  token: string; // e.g. KQ-RANDOM4
  agriStackId: string;
  farmerName?: string;
  landholding?: string;
  block?: string;
  crop: string;
  quantity: string;
  mandi: string;
  slot: string;
  issuedAt: string;
  qrPayload: string;
}

export interface MessagePillOption {
  id: string;
  label: string;
  value: string;
}

export interface VoiceNoteData {
  duration: string;
  audioDurationSec: number;
  transcript: string;
  audioToneFrequency?: number;
}

export interface VerificationCardData {
  farmerName: string;
  agriStackId: string;
  landholding: string;
  location: string;
  quotaUtilized: string;
  verifiedBadgeText?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  step?: BotStep;
  pills?: MessagePillOption[];
  passData?: GatePassData;
  voiceNote?: VoiceNoteData;
  verificationCard?: VerificationCardData;
  isError?: boolean;
}

export interface FarmerFormData {
  language: SupportedLanguage | null;
  agriStackId: string;
  farmerName?: string;
  landholding?: string;
  block?: string;
  crop: string;
  quantity: string;
  mandi: string;
}

export interface ChatContact {
  id: string;
  name: string;
  subtitle?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isPinned?: boolean;
  isVerified?: boolean;
  isGroup?: boolean;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarBg?: string;
  onlineStatus?: string;
  messages: ChatMessage[];
}
