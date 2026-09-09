'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  SupportedLanguage,
  BotStep,
  ChatMessage,
  FarmerFormData,
  GatePassData,
  MessagePillOption,
  VerificationCardData,
  VoiceNoteData,
} from '@/types/chat';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '@/lib/translations';
import { playIncomingSound, playOutgoingSound } from '@/lib/sound';
import { saveLatestPass } from '@/lib/passStore';
import { lookupAgriStackProfile } from '@/lib/agristackDataset';
import QRCode from 'qrcode';

function formatWhatsAppTime(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Convert native Indic script numerals (Devanagari, Bengali, Gujarati, Kannada, Tamil) to ASCII digits
export function normalizeIndicDigits(str: string): string {
  return str.replace(/[\u0966-\u096F\u09E6-\u09EF\u0AE6-\u0AEF\u0CE6-\u0CEF\u0BE6-\u0BEF]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 0x0966 && code <= 0x096F) return String(code - 0x0966); // Devanagari
    if (code >= 0x09E6 && code <= 0x09EF) return String(code - 0x09E6); // Bengali
    if (code >= 0x0AE6 && code <= 0x0AEF) return String(code - 0x0AE6); // Gujarati
    if (code >= 0x0CE6 && code <= 0x0CEF) return String(code - 0x0CE6); // Kannada
    if (code >= 0x0BE6 && code <= 0x0BEF) return String(code - 0x0BE6); // Tamil
    return char;
  });
}

function generateRandomToken(length: number = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KQ-${result}`;
}

function getStateCodeForLanguage(lang: SupportedLanguage): string {
  switch (lang) {
    case 'bn':
      return 'WB';
    case 'hi':
      return 'DL';
    case 'gu':
      return 'GJ';
    case 'kn':
      return 'KA';
    case 'ta':
      return 'TN';
    default:
      return 'IN';
  }
}

export function useChatStateMachine() {
  const [currentStep, setCurrentStep] = useState<BotStep>(BotStep.STEP_0_LANGUAGE);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [formData, setFormData] = useState<FarmerFormData>({
    language: null,
    agriStackId: '',
    farmerName: '',
    landholding: '',
    block: '',
    crop: '',
    quantity: '',
    mandi: '',
  });

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // On initial mount / app load: ONLY the very first welcome message bubble with language selection chips
  useEffect(() => {
    const initialT = TRANSLATIONS.en;
    const initialPills: MessagePillOption[] = LANGUAGE_OPTIONS.map((opt) => ({
      id: opt.code,
      label: opt.label,
      value: opt.code,
    }));

    const welcomeMsg: ChatMessage = {
      id: 'welcome-0',
      sender: 'bot',
      text: initialT.welcomeMessage,
      timestamp: formatWhatsAppTime(),
      step: BotStep.STEP_0_LANGUAGE,
      pills: initialPills,
    };

    setMessages([welcomeMsg]);
  }, []);

  // Helper to append a bot message with simulated typing delay (500ms - 800ms)
  const queueBotReply = useCallback(
    (
      text: string,
      options?: {
        step?: BotStep;
        pills?: MessagePillOption[];
        passData?: GatePassData;
        voiceNote?: VoiceNoteData;
        verificationCard?: VerificationCardData;
        isError?: boolean;
        delay?: number;
      }
    ) => {
      const delay = options?.delay ?? 600; // ~600ms simulated typing delay
      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}-${Math.random()}`,
          sender: 'bot',
          text,
          timestamp: formatWhatsAppTime(),
          step: options?.step,
          pills: options?.pills,
          passData: options?.passData,
          voiceNote: options?.voiceNote,
          verificationCard: options?.verificationCard,
          isError: options?.isError,
        };
        setMessages((prev) => [...prev, botMsg]);
        playIncomingSound();
      }, delay);
    },
    []
  );

  // Restart / Reset flow
  const resetFlow = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setCurrentStep(BotStep.STEP_0_LANGUAGE);
    setSelectedLanguage('en');
    setFormData({
      language: null,
      agriStackId: '',
      farmerName: '',
      landholding: '',
      block: '',
      crop: '',
      quantity: '',
      mandi: '',
    });

    const initialT = TRANSLATIONS.en;
    const initialPills: MessagePillOption[] = LANGUAGE_OPTIONS.map((opt) => ({
      id: opt.code,
      label: opt.label,
      value: opt.code,
    }));

    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'bot',
      text: initialT.welcomeMessage,
      timestamp: formatWhatsAppTime(),
      step: BotStep.STEP_0_LANGUAGE,
      pills: initialPills,
    };

    setMessages([welcomeMsg]);
  }, []);

  // Handle user sending text, clicking an option pill, or sending a voice note
  const handleUserSend = useCallback(
    async (userInput: string, isVoiceNote?: boolean) => {
      const trimmed = userInput.trim();
      if (!trimmed || isTyping) return;

      // 1. Append outgoing user message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: isVoiceNote ? '' : trimmed,
        timestamp: formatWhatsAppTime(),
        status: 'read',
        voiceNote: isVoiceNote
          ? {
              duration: '0:04',
              audioDurationSec: 4,
              transcript: trimmed,
              audioToneFrequency: 220,
            }
          : undefined,
      };
      setMessages((prev) => [...prev, userMsg]);
      playOutgoingSound();

      // 2. Evaluate State Machine
      switch (currentStep) {
        // STEP 0: LANGUAGE SELECTION
        case BotStep.STEP_0_LANGUAGE: {
          const lower = trimmed.toLowerCase();
          let chosenLang: SupportedLanguage | null = null;

          // Check if matches direct code or label
          for (const opt of LANGUAGE_OPTIONS) {
            if (
              lower === opt.code.toLowerCase() ||
              lower === opt.label.toLowerCase() ||
              lower === opt.sublabel.toLowerCase()
            ) {
              chosenLang = opt.code;
              break;
            }
          }

          // Fallback matching for natural inputs (e.g. "hindi", "bengali", "বাংলা", etc.)
          if (!chosenLang) {
            if (lower.includes('eng')) chosenLang = 'en';
            else if (lower.includes('ben') || lower.includes('বাংলা') || lower.includes('bangla')) chosenLang = 'bn';
            else if (lower.includes('hin') || lower.includes('हिंदी') || lower.includes('hindi')) chosenLang = 'hi';
            else if (lower.includes('guj') || lower.includes('ગુજરાતી') || lower.includes('gujarati')) chosenLang = 'gu';
            else if (lower.includes('kan') || lower.includes('ಕನ್ನಡ') || lower.includes('kannada')) chosenLang = 'kn';
            else if (lower.includes('tam') || lower.includes('தமிழ்') || lower.includes('tamil')) chosenLang = 'ta';
          }

          if (!chosenLang) {
            // Invalid selection, re-prompt
            const pills: MessagePillOption[] = LANGUAGE_OPTIONS.map((opt) => ({
              id: opt.code,
              label: opt.label,
              value: opt.code,
            }));
            queueBotReply(
              '⚠️ Please choose one of the supported languages / कृपया समर्थित भाषाओं में से एक चुनें:',
              { step: BotStep.STEP_0_LANGUAGE, pills, isError: true }
            );
            return;
          }

          // Language Selected!
          setSelectedLanguage(chosenLang);
          setFormData((prev) => ({ ...prev, language: chosenLang }));
          setCurrentStep(BotStep.STEP_1_AGRISTACK);

          const t = TRANSLATIONS[chosenLang];
          const step1Pills: MessagePillOption[] = [
            { id: 'sample-agristack', label: `Demo ID: ${t.step1Sample}`, value: t.step1Sample },
          ];

          queueBotReply(t.step1Prompt, {
            step: BotStep.STEP_1_AGRISTACK,
            pills: step1Pills,
          });
          break;
        }

        // STEP 1: AGRISTACK ID (Accepts strictly 7-digit numeric string ^\d{7}$ or official AgriStack format AS-XX-XXXX)
        case BotStep.STEP_1_AGRISTACK: {
          const lang = selectedLanguage;
          const t = TRANSLATIONS[lang];
          const normalizedId = normalizeIndicDigits(trimmed);
          const isNumeric7 = /^\d{7}$/.test(normalizedId);
          const isAgriStackFormat = /^AS-[A-Z]{2}-\d{4}$/i.test(trimmed);
          const isValidAgriId = isNumeric7 || isAgriStackFormat;

          if (!isValidAgriId) {
            const errorPills: MessagePillOption[] = [
              { id: 'sample-agristack', label: `Use Demo ID: ${t.step1Sample}`, value: t.step1Sample },
            ];
            queueBotReply(t.step1Error, {
              step: BotStep.STEP_1_AGRISTACK,
              pills: errorPills,
              isError: true,
            });
            return;
          }

          // Dynamic lookup from 15 farmer dataset
          const resolvedProfile = lookupAgriStackProfile(trimmed);

          // Valid AgriStack ID & dynamically resolved farmer profile
          setFormData((prev) => ({
            ...prev,
            agriStackId: resolvedProfile.agriStackId,
            farmerName: resolvedProfile.name,
            landholding: resolvedProfile.land,
            block: resolvedProfile.block,
            mandi: resolvedProfile.mandis[0],
          }));
          setCurrentStep(BotStep.STEP_2_CROP);

          const cropPills: MessagePillOption[] = t.step2Suggestions.map((crop) => ({
            id: `crop-${crop}`,
            label: `🌾 ${crop}`,
            value: crop,
          }));

          queueBotReply(t.step2Prompt, {
            step: BotStep.STEP_2_CROP,
            pills: cropPills,
            verificationCard: {
              farmerName: resolvedProfile.name,
              agriStackId: resolvedProfile.agriStackId,
              landholding: resolvedProfile.land,
              location: resolvedProfile.block,
              quotaUtilized: 'Quota Safe (19.2% utilized)',
            },
          });
          break;
        }

        // STEP 2: CROP NAME (Text only; cannot be purely numbers or contain numeric digits: ^[^\d]+$)
        case BotStep.STEP_2_CROP: {
          const lang = selectedLanguage;
          const t = TRANSLATIONS[lang];
          // Reject if contains any ASCII digit or normalized digit, or if length < 2
          const normalizedCrop = normalizeIndicDigits(trimmed);
          const hasNoDigits = !/\d/.test(normalizedCrop) && trimmed.replace(/\s+/g, '').length >= 2;

          if (!hasNoDigits) {
            const cropPills: MessagePillOption[] = t.step2Suggestions.map((crop) => ({
              id: `crop-${crop}`,
              label: `🌾 ${crop}`,
              value: crop,
            }));
            queueBotReply(t.step2Error, {
              step: BotStep.STEP_2_CROP,
              pills: cropPills,
              isError: true,
            });
            return;
          }

          // Valid Crop Name
          setFormData((prev) => ({ ...prev, crop: trimmed }));
          setCurrentStep(BotStep.STEP_3_QUANTITY);

          const qtyPills: MessagePillOption[] = t.step3Suggestions.map((qty) => ({
            id: `qty-${qty}`,
            label: `⚖️ ${qty}`,
            value: qty,
          }));

          const promptWithCrop = t.step3Prompt.replace('{crop}', trimmed);
          queueBotReply(promptWithCrop, {
            step: BotStep.STEP_3_QUANTITY,
            pills: qtyPills,
          });
          break;
        }

        // STEP 3: QUANTITY (Must be alphanumeric e.g. "50 Quintals", "20 bags", "100kg" - contains text + numbers. Rejects plain numbers or empty input)
        case BotStep.STEP_3_QUANTITY: {
          const lang = selectedLanguage;
          const t = TRANSLATIONS[lang];

          // Check for alphanumeric: must have at least one digit and at least one non-digit letter/unit
          const normalizedQty = normalizeIndicDigits(trimmed);
          const hasDigit = /\d/.test(normalizedQty);
          const hasUnitOrLetter = /[^\d\s]/.test(normalizedQty);
          const isValidQty = hasDigit && hasUnitOrLetter && trimmed.length >= 3;

          if (!isValidQty) {
            const qtyPills: MessagePillOption[] = t.step3Suggestions.map((qty) => ({
              id: `qty-${qty}`,
              label: `⚖️ ${qty}`,
              value: qty,
            }));
            queueBotReply(t.step3Error, {
              step: BotStep.STEP_3_QUANTITY,
              pills: qtyPills,
              isError: true,
            });
            return;
          }

          // Valid Quantity
          setFormData((prev) => ({ ...prev, quantity: trimmed }));
          setCurrentStep(BotStep.STEP_4_MANDI);

          // Resolve regional mandis mapped strictly to the farmer's registered block & state
          const currentProfile = lookupAgriStackProfile(formData.agriStackId);
          const regionalMandis =
            currentProfile?.mandis && currentProfile.mandis.length > 0
              ? currentProfile.mandis
              : ['Burdwan Central APMC', 'Kalna Regulated Market', 'Memari Mandi'];
          const nearestMandi = regionalMandis[0];

          const mandiPills: MessagePillOption[] = regionalMandis.map((mandi, idx) => ({
            id: `mandi-${idx}-${mandi.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
            label: idx === 0 ? `📍 ${mandi} (Nearest)` : `🏛️ ${mandi}`,
            value: mandi,
          }));

          const promptText = `🏛️ *Nearest Mandi Auto-Detected: ${nearestMandi}*\n📍 *Registered Land Block: ${formData.block || currentProfile.block}*\n\n${t.step4Prompt}`;

          queueBotReply(promptText, {
            step: BotStep.STEP_4_MANDI,
            pills: mandiPills,
          });
          break;
        }

        // STEP 4: NEAREST MANDI (Accepts any text input or clicked pill)
        case BotStep.STEP_4_MANDI: {
          const lang = selectedLanguage;
          const t = TRANSLATIONS[lang];

          if (trimmed.length < 2) {
            const currentProfile = lookupAgriStackProfile(formData.agriStackId);
            const regionalMandis =
              currentProfile?.mandis && currentProfile.mandis.length > 0
                ? currentProfile.mandis
                : ['Burdwan Central APMC', 'Kalna Regulated Market', 'Memari Mandi'];
            const mandiPills: MessagePillOption[] = regionalMandis.map((mandi, idx) => ({
              id: `mandi-${idx}-${mandi.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
              label: idx === 0 ? `📍 ${mandi} (Nearest)` : `🏛️ ${mandi}`,
              value: mandi,
            }));

            queueBotReply('⚠️ Please enter a valid Mandi or APMC location name.', {
              step: BotStep.STEP_4_MANDI,
              pills: mandiPills,
              isError: true,
            });
            return;
          }

          // Strip any leading emoji or trailing '(Nearest)' tag if entered or clicked
          let cleanMandi = trimmed.replace(/^[📍🏛️]\s*/, '').replace(/\s*\(Nearest\)$/i, '').trim();
          if (!cleanMandi) cleanMandi = trimmed;

          const currentProfile = lookupAgriStackProfile(formData.agriStackId);
          const currentAgriId = formData.agriStackId || currentProfile.agriStackId;
          const currentFarmerName = formData.farmerName || currentProfile.name;
          const currentLand = formData.landholding || currentProfile.land;
          const currentBlock = formData.block || currentProfile.block;
          const currentCrop = formData.crop;
          const currentQty = formData.quantity;
          const currentMandi = cleanMandi;

          setFormData((prev) => ({ ...prev, mandi: currentMandi }));
          setCurrentStep(BotStep.STEP_5_PASS_ISSUED);

          // STEP 5: Generate Final Pass Card & Scannable QR Code
          const randomToken = generateRandomToken(4);
          const stateCode = currentProfile.stateCode || getStateCodeForLanguage(lang);
          const passCode = `KQ-${Math.floor(1000 + Math.random() * 9000)}-${stateCode}`;

          const qrPayloadObj = {
            token: randomToken,
            id: currentAgriId,
            name: currentFarmerName,
            land: currentLand,
            block: currentBlock,
            crop: currentCrop,
            mandi: currentMandi,
          };
          const qrPayloadString = JSON.stringify(qrPayloadObj);

          let qrDataUrl = '';
          try {
            qrDataUrl = await QRCode.toDataURL(qrPayloadString, {
              width: 320,
              margin: 1,
              color: {
                dark: '#075E54',
                light: '#FFFFFF',
              },
            });
          } catch (err) {
            console.error('Failed to generate QR code:', err);
          }

          const passData: GatePassData = {
            passCode,
            token: randomToken,
            agriStackId: currentAgriId,
            farmerName: currentFarmerName,
            landholding: currentLand,
            block: currentBlock,
            crop: currentCrop,
            quantity: currentQty,
            mandi: currentMandi,
            slot: t.passCard.slotValue,
            issuedAt: new Date().toISOString(),
            qrPayload: qrDataUrl,
          };

          // Save and broadcast pass to Officer View in real-time
          saveLatestPass(passData);

          // Bot confirmation message with WhatsApp media card
          queueBotReply(t.step5Success, {
            step: BotStep.STEP_5_PASS_ISSUED,
            passData,
          });
          break;
        }

        // STEP 5: If user types after pass issuance, provide option to book another
        case BotStep.STEP_5_PASS_ISSUED: {
          const t = TRANSLATIONS[selectedLanguage];
          const pills: MessagePillOption[] = [
            { id: 'reset', label: `🔄 ${t.passCard.bookAnotherBtn}`, value: 'reset' },
          ];
          if (trimmed.toLowerCase().includes('reset') || trimmed.toLowerCase().includes('another') || trimmed.toLowerCase().includes('new')) {
            resetFlow();
          } else {
            queueBotReply(
              `✨ Your Gate Pass (${formData.crop} at ${formData.mandi}) is active! Would you like to issue another pass?`,
              { step: BotStep.STEP_5_PASS_ISSUED, pills }
            );
          }
          break;
        }

        default:
          break;
      }
    },
    [currentStep, selectedLanguage, formData, isTyping, queueBotReply, resetFlow]
  );

  return {
    currentStep,
    selectedLanguage,
    setSelectedLanguage,
    isTyping,
    messages,
    formData,
    handleUserSend,
    resetFlow,
  };
}
