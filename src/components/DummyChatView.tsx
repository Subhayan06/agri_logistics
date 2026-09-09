'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  Search,
  MoreVertical,
  CheckCheck,
  Smile,
  Paperclip,
  Mic,
  Send,
  Users,
} from 'lucide-react';
import { ChatContact, ChatMessage } from '@/types/chat';
import { WhatsAppBackground } from './WhatsAppBackground';
import { playIncomingSound, playOutgoingSound } from '@/lib/sound';

interface DummyChatViewProps {
  contact: ChatContact;
  onBackToChatList: () => void;
  onSwitchToKrishiQ: () => void;
}

export const DummyChatView: React.FC<DummyChatViewProps> = ({
  contact,
  onBackToChatList,
  onSwitchToKrishiQ,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(contact.messages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: ChatMessage = {
      id: `dummy-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'read',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    playOutgoingSound();

    // Auto simulated reply after 700ms
    setTimeout(() => {
      let replyText = 'Received your message. We will update you shortly.';
      if (contact.id === 'ksk') {
        replyText =
          'Kisan Seva Kendra Notice: For instant mandi e-gate pass issuance, please switch to KrishiQ Mandi Bot.';
      } else if (contact.id === 'ramesh') {
        replyText =
          'Ji Bhaiya, tractor is waiting in the inbound queue outside Gate #3 weighbridge.';
      } else if (contact.id === 'fertilizer') {
        replyText =
          'Cooperative update: Counter #2 is open for bio-fertilizer and micronutrient distribution.';
      } else if (contact.id === 'mandi-vyapar') {
        replyText =
          'e-NAM Notice: Weighbridge inbound tokens are synced directly through the KrishiQ gate pass system.';
      }

      const botReply: ChatMessage = {
        id: `dummy-reply-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, botReply]);
      playIncomingSound();
    }, 700);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-[#EFEAE2] overflow-hidden select-none">
      {/* Top Header */}
      <header className="relative bg-[#075E54] text-white px-2 sm:px-4 py-2.5 flex items-center justify-between shadow-md z-30">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBackToChatList}
            aria-label="Back to chat list"
            className="p-1 -ml-1 text-white/90 hover:text-white rounded-full hover:bg-white/10 active:scale-95 transition md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm flex-shrink-0 ${
              contact.avatarBg || 'bg-emerald-700'
            }`}
          >
            {contact.isGroup ? (
              <Users className="w-5 h-5 text-white" />
            ) : (
              <span>{contact.avatarInitials || contact.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          {/* Contact Info */}
          <div className="min-w-0 flex flex-col justify-center">
            <h2 className="font-semibold text-[15px] sm:text-[16px] leading-tight text-white tracking-wide truncate">
              {contact.name}
            </h2>
            <p className="text-[11px] text-white/80 leading-tight truncate">
              {contact.onlineStatus || contact.subtitle || 'Tap here for contact info'}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-white/90">
          <button
            type="button"
            onClick={onSwitchToKrishiQ}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba5a] text-[#075E54] font-bold text-xs rounded-full shadow transition active:scale-95"
            title="Switch to KrishiQ Bot"
          >
            <span>🌾 KrishiQ Bot</span>
          </button>

          <button
            type="button"
            aria-label="Video call"
            className="p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Voice call"
            className="p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          >
            <Phone className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Search"
            className="p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="More options"
            className="p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition active:scale-95"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Floating Info Banner */}
      <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-3 py-1.5 flex items-center justify-between text-xs text-[#92400E] z-20">
        <span className="truncate">
          Viewing <strong>{contact.name}</strong> history.
        </span>
        <button
          type="button"
          onClick={onSwitchToKrishiQ}
          className="text-[11px] font-bold text-[#075E54] underline hover:text-[#054c44] flex-shrink-0 ml-2"
        >
          Book Gate Pass in KrishiQ →
        </button>
      </div>

      {/* Message Area with WhatsApp Wallpaper */}
      <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
        <WhatsAppBackground />
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-2">
          {/* Encryption Notice */}
          <div className="flex justify-center my-2">
            <div className="bg-[#FFEECD] text-[#54656F] text-[11px] px-3 py-1.5 rounded-lg text-center max-w-[85%] sm:max-w-[70%] shadow-xs border border-[#F6E0B5]">
              🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
            </div>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`w-full flex flex-col my-1 ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[85%] sm:max-w-[70%] px-3 py-1.5 rounded-lg shadow-sm text-sm select-text ${
                    isUser
                      ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-none'
                      : 'bg-[#FFFFFF] text-[#111B21] rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed text-[13.5px] sm:text-[14px]">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5 text-[10px] text-[#667781] select-none ml-auto float-right">
                    <span>{msg.timestamp}</span>
                    {isUser && (
                      <span title="Read" className="text-[#53BDEB]">
                        <CheckCheck className="w-3.5 h-3.5 inline stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                  <div className="clear-both" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Bar */}
      <footer className="relative bg-[#F0F2F5] px-2 sm:px-3 py-2 border-t border-[#E2E8F0] z-20">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="p-2 text-[#54656F] hover:text-[#111B21] rounded-full hover:bg-slate-200 transition"
          >
            <Smile className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-2 text-[#54656F] hover:text-[#111B21] rounded-full hover:bg-slate-200 transition"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-white rounded-lg px-3 py-2 flex items-center border border-slate-200 shadow-xs">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message ${contact.name}...`}
              className="bg-transparent text-sm text-[#111B21] placeholder-[#54656F] outline-none w-full"
            />
          </div>
          {inputText.trim() ? (
            <button
              type="button"
              onClick={handleSend}
              className="p-2.5 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white shadow-md transition active:scale-95 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setInputText('Okay, noted.');
              }}
              className="p-2 text-[#54656F] hover:text-[#111B21] rounded-full hover:bg-slate-200 transition"
              title="Quick reply"
            >
              <Mic className="w-6 h-6" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
