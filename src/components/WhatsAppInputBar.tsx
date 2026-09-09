'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Mic, Send, MicOff, Camera, FileText, Image as ImageIcon, MapPin, User, X } from 'lucide-react';
import { SupportedLanguage } from '@/types/chat';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '@/lib/translations';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface WhatsAppInputBarProps {
  language: SupportedLanguage;
  onSendMessage: (text: string, isVoiceNote?: boolean) => void;
  disabled?: boolean;
}

const COMMON_EMOJIS = [
  '🌾', '🚜', '🥔', '🍅', '🌽', '🌱', '🚛', '⚖️', '🇮🇳', '👍', '🙏', '✅', '📦', '💰', '☀️',
  '😀', '😊', '🤝', '📋', '🚚', '📍', '🏢', '🏷️', '💧', '🌾', '🥭', '🧅', '🌶️', '🍌',
];

export const WhatsAppInputBar: React.FC<WhatsAppInputBarProps> = ({
  language,
  onSendMessage,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS.en.ui;
  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language);
  const speechLang = currentLangObj?.speechCode || 'en-IN';

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition(speechLang);

  // Sync speech transcript into input
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (!inputText.trim() || disabled) return;
    if (isListening) {
      stopListening();
    }
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else if (isSupported) {
      startListening((finalText) => {
        if (finalText) {
          onSendMessage(finalText, true);
          setInputText('');
        }
      });
    } else {
      // Graceful fallback for environments without Web Speech API
      const sampleVoiceNote =
        language === 'hi'
          ? 'गेहूं 20 क्विंटल'
          : language === 'bn'
          ? 'ধান ২০ কুইন্টাল'
          : 'Wheat 20 Quintals';
      onSendMessage(sampleVoiceNote, true);
    }
  };

  const addEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <footer className="relative bg-[#F0F2F5] px-2 sm:px-3 py-2 border-t border-[#E2E8F0] z-20 select-none">
      {/* Attach Popup Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-12 bg-white rounded-xl shadow-2xl p-3 grid grid-cols-3 gap-3 border border-slate-200 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              setInputText((p) => p + ' 📄 AgriStack ID doc');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#5F66CD] flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Document</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              setInputText((p) => p + ' 📸 Mandi Weighment photo');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#EC407A] flex items-center justify-center text-white shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Camera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              setInputText((p) => p + ' 🖼️ Crop photo');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#AC44CF] flex items-center justify-center text-white shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              setInputText((p) => p + ' 📍 Burdwan APMC');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Location</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              setInputText((p) => p + ' 👤 Mandi Officer Contact');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#007BFF] flex items-center justify-center text-white shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAttachMenu(false)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <X className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Close</span>
          </button>
        </div>
      )}

      {/* Emoji Quick Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-3 bg-white rounded-xl shadow-xl p-2.5 border border-slate-200 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-xs font-semibold text-slate-500">
            <span>Agri & Mandi Emojis</span>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-w-[280px]">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="text-xl p-1.5 hover:bg-slate-100 rounded-lg transition active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mic Recording Overlay Banner */}
      {isListening && (
        <div className="mb-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs text-emerald-800 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">{t.listening}</span>
            <span className="text-[10px] text-emerald-600">({speechLang})</span>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs underline"
          >
            Done
          </button>
        </div>
      )}

      {/* Input Bar Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Smiley Emoji Toggle */}
        <button
          type="button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowAttachMenu(false);
          }}
          className={`p-2 rounded-full transition active:scale-95 ${
            showEmojiPicker ? 'text-[#075E54] bg-slate-200' : 'text-[#54656F] hover:text-slate-800'
          }`}
          title="Emojis"
        >
          <Smile className="w-6 h-6" />
        </button>

        {/* Paperclip Attachment */}
        <button
          type="button"
          onClick={() => {
            setShowAttachMenu(!showAttachMenu);
            setShowEmojiPicker(false);
          }}
          className={`p-2 rounded-full transition active:scale-95 ${
            showAttachMenu ? 'text-[#075E54] bg-slate-200' : 'text-[#54656F] hover:text-slate-800'
          }`}
          title="Attach"
        >
          <Paperclip className="w-5 h-5 rotate-45" />
        </button>

        {/* Text Input Container */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={isListening ? t.listening : t.inputPlaceholder}
            className="w-full bg-white text-[#111B21] placeholder-[#8696A0] text-sm sm:text-[15px] px-4 py-2.5 rounded-lg border-none outline-none shadow-xs focus:ring-1 focus:ring-[#00A884]"
          />
        </div>

        {/* Dynamic Send / Mic Button */}
        {inputText.trim().length > 0 ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled}
            className="p-2.5 bg-[#00A884] hover:bg-[#075E54] text-white rounded-full shadow-md transition active:scale-90 flex-shrink-0"
            title="Send message"
          >
            <Send className="w-5 h-5 -rotate-45 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-2.5 rounded-full transition active:scale-90 flex-shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg ring-4 ring-rose-300'
                : 'bg-[#00A884] hover:bg-[#075E54] text-white shadow-md'
            }`}
            title={
              isSupported
                ? isListening
                  ? 'Stop listening'
                  : `Voice Input (${speechLang})`
                : `Simulate Voice Note (${speechLang})`
            }
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}
      </div>
    </footer>
  );
};
