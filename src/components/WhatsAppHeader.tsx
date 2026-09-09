'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Video, Phone, Search, MoreVertical, RotateCcw, Globe, Info, Volume2, VolumeX } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { SupportedLanguage } from '@/types/chat';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '@/lib/translations';

interface WhatsAppHeaderProps {
  language: SupportedLanguage;
  isTyping: boolean;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onReset: () => void;
  onBackToChatList?: () => void;
}

export const WhatsAppHeader: React.FC<WhatsAppHeaderProps> = ({
  language,
  isTyping,
  onSelectLanguage,
  onReset,
  onBackToChatList,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS.en.ui;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative bg-[#075E54] text-white px-2 sm:px-4 py-2.5 flex items-center justify-between shadow-md z-30 select-none">
      {/* Left section: Back button + Avatar + Title/Status */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onBackToChatList}
          aria-label="Back to chat list"
          className="p-1 -ml-1 text-white/90 hover:text-white rounded-full hover:bg-white/10 active:scale-95 transition md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Profile Avatar using /logo.png */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/20 bg-[#054c44] shadow-sm flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="KrishiQ Profile Avatar"
            width={40}
            height={40}
            className="w-full h-full object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Chat Info */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <h1 className="font-semibold text-[14.5px] sm:text-[16px] leading-tight text-white tracking-wide truncate">
              KrishiQ: Official Mandi Bot
            </h1>
            <VerifiedBadge size={16} />
          </div>
          <div className="text-[11px] leading-tight flex items-center gap-1">
            {isTyping ? (
              <span className="text-[#25D366] font-medium tracking-wide animate-pulse">
                {t.typing}
              </span>
            ) : (
              <span className="text-white/85 font-normal tracking-wide truncate flex items-center gap-1.5">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                </span>
                <span>Official Business Account • online</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right action icons: Video call, Phone call, Search, More options */}
      <div className="flex items-center gap-0.5 sm:gap-1.5 text-white/90" ref={menuRef}>
        {/* Quick Language Toggle Pill */}
        <button
          type="button"
          onClick={() => setLangMenuOpen(!langMenuOpen)}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition border border-white/15"
          title="Change language"
        >
          <Globe className="w-3.5 h-3.5 text-[#A7F3D0]" />
          <span>{LANGUAGE_OPTIONS.find((l) => l.code === language)?.label || 'English'}</span>
        </button>

        {/* Video Call */}
        <button
          type="button"
          aria-label="Video call"
          className="p-1.5 sm:p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Phone Call */}
        <button
          type="button"
          aria-label="Voice call"
          className="p-1.5 sm:p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          title="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* Search Icon */}
        <button
          type="button"
          aria-label="Search conversation"
          className="p-1.5 sm:p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          title="Search in chat"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* More Options (Three Dots) */}
        <div className="relative">
          <button
            type="button"
            aria-label="More options"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 sm:p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* WhatsApp Style Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white rounded-md shadow-xl py-1 z-50 text-slate-800 text-sm border border-slate-100 animate-in fade-in duration-100">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setLangMenuOpen(true);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition"
              >
                <Globe className="w-4 h-4 text-[#075E54]" />
                <span>Switch Language</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onReset();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 text-rose-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.resetChat}</span>
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 transition"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#075E54]" />
                    <span>Notification Sounds: On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <span>Notification Sounds: Off</span>
                  </>
                )}
              </button>

              <div className="border-t border-slate-100 my-1" />

              <div className="px-4 py-2 text-[11px] text-slate-500 flex items-start gap-1.5 leading-tight">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
                <span>KrishiQ APMC e-Gate Pass v2.4 • AgriStack Integrated</span>
              </div>
            </div>
          )}

          {/* Language Selection Modal Dropdown */}
          {langMenuOpen && (
            <div className="absolute right-0 top-11 w-56 bg-white rounded-md shadow-xl py-1.5 z-50 text-slate-800 text-sm border border-slate-100 animate-in fade-in duration-100">
              <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-1">
                Select Language
              </div>
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition ${
                    language === lang.code
                      ? 'bg-[#E7F7E9] text-[#075E54] font-bold'
                      : 'text-slate-800'
                  }`}
                >
                  <span className="text-sm">{lang.label}</span>
                  <span className="text-xs text-slate-400">({lang.sublabel})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
