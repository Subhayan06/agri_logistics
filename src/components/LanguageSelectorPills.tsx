'use client';

import React from 'react';
import { LANGUAGE_OPTIONS } from '@/lib/translations';
import { SupportedLanguage } from '@/types/chat';

interface LanguageSelectorPillsProps {
  onSelectLanguage: (lang: string) => void;
  selectedLanguage?: SupportedLanguage;
}

export const LanguageSelectorPills: React.FC<LanguageSelectorPillsProps> = ({
  onSelectLanguage,
  selectedLanguage,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#00000010]">
      {LANGUAGE_OPTIONS.map((lang) => {
        const isSelected = selectedLanguage === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => onSelectLanguage(lang.code)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm border flex items-center gap-1.5 active:scale-95 ${
              isSelected
                ? 'bg-[#075E54] text-white border-[#075E54] shadow-md ring-2 ring-[#075E5433]'
                : 'bg-[#F0F2F5] hover:bg-[#E2E8F0] text-[#111B21] border-[#CBD5E1] hover:border-[#94A3B8]'
            }`}
          >
            <span className="font-bold text-[13px]">{lang.label}</span>
            <span className="text-[10px] opacity-75 font-normal">({lang.sublabel})</span>
          </button>
        );
      })}
    </div>
  );
};
