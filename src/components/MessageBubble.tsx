'use client';

import React from 'react';
import { ChatMessage, SupportedLanguage } from '@/types/chat';
import { CheckCheck } from 'lucide-react';
import { GatePassCard } from './GatePassCard';
import { LanguageSelectorPills } from './LanguageSelectorPills';
import { VoiceNoteBubble } from './VoiceNoteBubble';
import { AgriStackVerificationCard } from './AgriStackVerificationCard';

interface MessageBubbleProps {
  message: ChatMessage;
  language: SupportedLanguage;
  onPillClick: (value: string) => void;
  onReset: () => void;
}

// Simple markdown formatter for WhatsApp bold (*text*) and newlines
function formatMessageText(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Replace *bold* with <strong>
    const parts = line.split(/(\*[^*]+\*)/g);
    return (
      <span key={lineIdx} className="block min-h-[1.2em]">
        {parts.map((part, pIdx) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <strong key={pIdx} className="font-semibold text-slate-900">
                {part.slice(1, -1)}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </span>
    );
  });
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  language,
  onPillClick,
  onReset,
}) => {
  const isBot = message.sender === 'bot';
  const isUser = message.sender === 'user';
  const isLanguageStep = message.step === 0 && isBot;

  return (
    <div
      className={`w-full flex flex-col my-1 ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] px-3 py-1.5 rounded-lg shadow-sm text-sm transition-all select-text ${
          isUser
            ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-none'
            : 'bg-[#FFFFFF] text-[#111B21] rounded-tl-none'
        } ${message.isError ? 'border-l-4 border-amber-500' : ''}`}
      >
        {/* WhatsApp Bubble Tail SVG */}
        {isUser ? (
          <span className="absolute -top-0 -right-2 text-[#D9FDD3] pointer-events-none">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
              <path
                d="M5.188 1H0v11.193l6.467-8.625C7.526 2.16 6.732 1 5.188 1z"
                fill="#D9FDD3"
              />
            </svg>
          </span>
        ) : (
          <span className="absolute -top-0 -left-2 text-white pointer-events-none">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
              <path
                d="M2.812 1H8v11.193L1.533 3.568C.474 2.16 1.268 1 2.812 1z"
                fill="#FFFFFF"
              />
            </svg>
          </span>
        )}

        {/* Voice Note Player if present */}
        {message.voiceNote && (
          <VoiceNoteBubble voiceNote={message.voiceNote} isUser={isUser} />
        )}

        {/* AgriStack Verification Check Card if present */}
        {message.verificationCard && (
          <AgriStackVerificationCard data={message.verificationCard} />
        )}

        {/* Message Content */}
        {message.text && (
          <div className="leading-relaxed text-[13.5px] sm:text-[14px] break-words">
            {formatMessageText(message.text)}
          </div>
        )}

        {/* Timestamp and Status Checkmarks */}
        <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5 text-[10px] text-[#667781] select-none ml-auto float-right">
          <span>{message.timestamp}</span>
          {isUser && (
            <span title="Read receipt" className="text-[#53BDEB]">
              <CheckCheck className="w-3.5 h-3.5 inline stroke-[2.5]" />
            </span>
          )}
        </div>
        <div className="clear-both" />

        {/* Pass Card for Step 5 */}
        {message.passData && (
          <div className="mt-1">
            <GatePassCard
              passData={message.passData}
              language={language}
              onReset={onReset}
            />
          </div>
        )}

        {/* Language Selection Pills for Step 0 */}
        {isLanguageStep && (
          <LanguageSelectorPills
            onSelectLanguage={onPillClick}
            selectedLanguage={language}
          />
        )}
      </div>

      {/* Quick Reply Pills for Suggestions (Steps 1, 2, 3, 4) */}
      {!isLanguageStep && message.pills && message.pills.length > 0 && isBot && (
        <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[85%] sm:max-w-[70%]">
          {message.pills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => onPillClick(pill.value)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFFFFF] hover:bg-[#F0F2F5] text-[#075E54] border border-[#CBD5E1] shadow-xs transition active:scale-95 flex items-center gap-1"
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
