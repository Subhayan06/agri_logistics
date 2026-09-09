'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage, SupportedLanguage } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { TRANSLATIONS } from '@/lib/translations';
import { Lock } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  language: SupportedLanguage;
  isTyping: boolean;
  onPillClick: (value: string) => void;
  onReset: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  language,
  isTyping,
  onPillClick,
  onReset,
}) => {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const t = TRANSLATIONS[language]?.ui || TRANSLATIONS.en.ui;

  const scrollToBottom = (smooth = true) => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  };

  useEffect(() => {
    scrollToBottom(true);
    const frameId = requestAnimationFrame(() => {
      scrollToBottom(true);
    });
    const timer = setTimeout(() => {
      scrollToBottom(true);
    }, 120);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [messages, isTyping]);

  return (
    <div className="relative flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-2 select-text custom-scrollbar">
      {/* Date Pill: "TODAY" */}
      <div className="flex justify-center my-2">
        <span className="bg-[#FFFFFF] text-[#54656F] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-md shadow-xs border border-black/5">
          {t.today}
        </span>
      </div>

      {/* End-to-End Encryption Notice Bubble */}
      <div className="flex justify-center my-2">
        <div className="bg-[#FFEECD] text-[#54656F] text-[11.5px] px-3.5 py-1.5 rounded-lg shadow-xs max-w-[85%] sm:max-w-[450px] text-center flex items-center justify-center gap-1.5 leading-snug border border-[#E9D9B4]">
          <Lock className="w-3.5 h-3.5 flex-shrink-0 text-[#856404]" />
          <span>{t.encryptionNotice}</span>
        </div>
      </div>

      {/* Render All Chat Messages */}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          language={language}
          onPillClick={onPillClick}
          onReset={onReset}
        />
      ))}

      {/* WhatsApp Simulated Typing Bubble */}
      {isTyping && (
        <div className="w-full flex items-start my-1.5">
          <div className="relative bg-white px-3.5 py-2.5 rounded-lg shadow-sm rounded-tl-none flex items-center gap-1.5 border border-slate-100">
            {/* Tail */}
            <span className="absolute -top-0 -left-2 text-white pointer-events-none">
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                <path
                  d="M2.812 1H8v11.193L1.533 3.568C.474 2.16 1.268 1 2.812 1z"
                  fill="#FFFFFF"
                />
              </svg>
            </span>
            <div className="w-2 h-2 rounded-full bg-[#00A884] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-[#00A884] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-[#00A884] animate-bounce" />
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={scrollEndRef} className="h-1" />
    </div>
  );
};
