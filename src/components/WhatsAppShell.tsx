'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  MessageSquarePlus,
  Search,
  Filter,
  Users,
  CircleDashed,
  Radio,
  MoreVertical,
  Pin,
  X,
  Sparkles,
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { WhatsAppHeader } from './WhatsAppHeader';
import { WhatsAppBackground } from './WhatsAppBackground';
import { MessageList } from './MessageList';
import { WhatsAppInputBar } from './WhatsAppInputBar';
import { DummyChatView } from './DummyChatView';
import { useChatStateMachine } from '@/hooks/useChatStateMachine';
import { SupportedLanguage, ChatContact } from '@/types/chat';

interface WhatsAppShellProps {
  isSplitMode?: boolean;
}

const DUMMY_CONTACTS: ChatContact[] = [
  {
    id: 'krishiq',
    name: 'KrishiQ: Mandi Gate Bot',
    subtitle: 'Official Business Account',
    lastMessage: '🌾 Welcome to KrishiQ - Official Mandi Bot! Please choose your preferred language to begin.',
    timestamp: 'Just now',
    unreadCount: 1,
    isPinned: true,
    isVerified: true,
    avatarUrl: '/logo.png',
    onlineStatus: 'online',
    messages: [], // dynamically driven by useChatStateMachine
  },
  {
    id: 'ksk',
    name: 'Kisan Seva Kendra (Kolkata Zone)',
    subtitle: 'Govt. Agriculture Extension Helpdesk',
    lastMessage: 'New MSP list updated for paddy',
    timestamp: 'Yesterday',
    isVerified: true,
    avatarInitials: 'KSK',
    avatarBg: 'bg-emerald-800',
    onlineStatus: 'Govt Portal Active • online',
    messages: [
      {
        id: 'ksk-1',
        sender: 'bot',
        text: '🌾 *Kisan Seva Kendra (Kolkata Zone) Official Notice*\n\nNamaskar Farmer Brother! The revised Minimum Support Price (MSP) schedule for Kharif 2026 Paddy is:\n• Common Variety: ₹2,300 / Qtl\n• Grade-A Variety: ₹2,320 / Qtl',
        timestamp: 'Yesterday, 04:15 PM',
      },
      {
        id: 'ksk-2',
        sender: 'user',
        text: 'Where can we submit soil samples for testing before rabi sowing?',
        timestamp: 'Yesterday, 04:30 PM',
        status: 'read',
      },
      {
        id: 'ksk-3',
        sender: 'bot',
        text: 'Soil health collection camp is open at Block Development Office, Room #14, Monday to Friday (10 AM - 4 PM). Please bring 500g dry soil from your registered plot.',
        timestamp: 'Yesterday, 04:32 PM',
      },
      {
        id: 'ksk-4',
        sender: 'bot',
        text: 'New MSP list updated for paddy. Direct benefit transfer (DBT) will be credited within 48 hours of weighbridge gate receipt verification.',
        timestamp: 'Yesterday, 05:00 PM',
      },
    ],
  },
  {
    id: 'ramesh',
    name: 'Ramesh Tractor Logistics',
    subtitle: 'Commercial Agri Carrier • WB-39-E-4819',
    lastMessage: 'Reached bypass entry',
    timestamp: '10:14 AM',
    avatarInitials: 'RT',
    avatarBg: 'bg-amber-600',
    onlineStatus: 'last seen today at 10:20 AM',
    messages: [
      {
        id: 'ram-1',
        sender: 'user',
        text: 'Ramesh bhaiya, how many quintals loaded on the trolley?',
        timestamp: '09:45 AM',
        status: 'read',
      },
      {
        id: 'ram-2',
        sender: 'bot',
        text: 'Bhaiya, exactly 40 bags of wheat (~20 Quintals) loaded and tied securely with green tarpaulin.',
        timestamp: '09:50 AM',
      },
      {
        id: 'ram-3',
        sender: 'user',
        text: 'Okay, generate the gate pass on KrishiQ and send me the gate number.',
        timestamp: '10:02 AM',
        status: 'read',
      },
      {
        id: 'ram-4',
        sender: 'bot',
        text: 'Reached bypass entry. Inbound traffic is moving fast towards Weighbridge Gate #3.',
        timestamp: '10:14 AM',
      },
    ],
  },
  {
    id: 'fertilizer',
    name: 'Fertilizer Cooperative Group',
    subtitle: 'Burdwan PACS & Farmers Society (142 members)',
    lastMessage: 'Subsidized DAP available',
    timestamp: 'Tuesday',
    isGroup: true,
    avatarInitials: 'FC',
    avatarBg: 'bg-teal-700',
    onlineStatus: '3 participants active',
    messages: [
      {
        id: 'fert-1',
        sender: 'bot',
        text: '📢 *PACS Cooperative Notice Board*\n\nSubsidized DAP available at primary society depot. Price fixed at ₹1,350 per 50kg bag under central fertilizer subsidy scheme.',
        timestamp: 'Tuesday, 11:20 AM',
      },
      {
        id: 'fert-2',
        sender: 'bot',
        text: 'Please bring your Kisan Credit Card (KCC) and Aadhaar for point-of-sale biometric authentication. Max quota: 5 bags per acre.',
        timestamp: 'Tuesday, 11:22 AM',
      },
      {
        id: 'fert-3',
        sender: 'user',
        text: 'Is Nano Urea liquid also in stock?',
        timestamp: 'Tuesday, 01:10 PM',
        status: 'read',
      },
      {
        id: 'fert-4',
        sender: 'bot',
        text: 'Yes, 500ml IFFCO Nano Urea bottles available at ₹225/bottle.',
        timestamp: 'Tuesday, 01:15 PM',
      },
    ],
  },
  {
    id: 'mandi-vyapar',
    name: 'Mandi Vyapar Mandal',
    subtitle: 'APMC Licensed Commission Agents Association',
    lastMessage: 'Auction opens tomorrow 6 AM',
    timestamp: '08/09/2026',
    avatarInitials: 'MV',
    avatarBg: 'bg-indigo-700',
    onlineStatus: 'Official Circular',
    messages: [
      {
        id: 'mvm-1',
        sender: 'bot',
        text: '🏛️ *Burdwan APMC Merchant Guild Notification*\n\nWeekly produce arrival guidelines: All inbound grain vehicles must hold an active digital gate pass before gate entry.',
        timestamp: '08/09/2026, 03:00 PM',
      },
      {
        id: 'mvm-2',
        sender: 'bot',
        text: 'Auction opens tomorrow 6 AM. Open electronic bidding on e-NAM terminal will conclude at 11:30 AM.',
        timestamp: '08/09/2026, 04:30 PM',
      },
    ],
  },
];

export const WhatsAppShell: React.FC<WhatsAppShellProps> = ({ isSplitMode = false }) => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    isTyping,
    messages,
    handleUserSend,
    resetFlow,
  } = useChatStateMachine();

  const [activeChatId, setActiveChatId] = useState<string>('krishiq');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Filter contacts by name or last message
  const filteredContacts = DUMMY_CONTACTS.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
  });

  const activeDummyContact = DUMMY_CONTACTS.find((c) => c.id === activeChatId && c.id !== 'krishiq');

  return (
    <main
      className={`relative w-full h-full ${
        isSplitMode
          ? 'bg-transparent'
          : 'h-[100dvh] bg-[#eae6df] flex items-center justify-center'
      } overflow-hidden font-sans`}
    >
      {/* WhatsApp Web Desktop Top Green Bar (hidden in split mode) */}
      {!isSplitMode && (
        <div className="hidden md:block absolute top-0 left-0 right-0 h-[127px] bg-[#00a884] z-0 pointer-events-none" />
      )}

      {/* Main WhatsApp Window Container */}
      <div
        className={`relative w-full h-full ${
          isSplitMode
            ? 'rounded-xl'
            : 'md:h-[calc(100vh-38px)] md:max-w-[1440px] md:mx-4 md:rounded-lg'
        } bg-white md:shadow-2xl flex overflow-hidden z-10 border border-[#d1d7db]`}
      >
        {/* 1. LEFT SIDEBAR (Visible on md+ screens or when toggled on mobile) */}
        <aside
          className={`${
            showMobileSidebar ? 'flex absolute inset-0 z-40' : 'hidden'
          } md:flex flex-col w-full md:w-[340px] lg:w-[400px] xl:w-[420px] bg-white border-r border-[#E2E8F0] flex-shrink-0 select-none`}
        >
          {/* Sidebar Top Header with authentic WhatsApp Web Icons */}
          <div className="h-[60px] bg-[#F0F2F5] px-3.5 flex items-center justify-between border-b border-[#E2E8F0] flex-shrink-0">
            {/* User Profile */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shadow-xs flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="My Farmer Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#111B21]">Kisan Portal</span>
                <span className="text-[10px] text-emerald-700 font-medium">Burdwan APMC</span>
              </div>
            </div>

            {/* WhatsApp Web Top Bar Action Icons */}
            <div className="flex items-center gap-1 text-[#54656F]">
              <button
                type="button"
                className="p-2 hover:bg-slate-200 rounded-full transition active:scale-95"
                title="Communities"
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-slate-200 rounded-full transition active:scale-95"
                title="Status"
              >
                <CircleDashed className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-slate-200 rounded-full transition active:scale-95"
                title="Channels"
              >
                <Radio className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveChatId('krishiq');
                  setShowMobileSidebar(false);
                }}
                className="p-2 hover:bg-slate-200 rounded-full transition active:scale-95 text-[#00A884]"
                title="New Chat / KrishiQ Bot"
              >
                <MessageSquarePlus className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-slate-200 rounded-full transition active:scale-95"
                title="Menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-2 border-b border-[#E2E8F0] bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#F0F2F5] rounded-lg px-3 py-1.5 flex items-center gap-2 text-[#54656F]">
                <Search className="w-4 h-4 text-[#54656F] flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search or start new chat"
                  className="bg-transparent text-sm text-[#111B21] placeholder-[#54656F] outline-none w-full font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                className="p-2 text-[#54656F] hover:bg-slate-100 rounded-lg transition"
                title="Filter chats"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
            {filteredContacts.map((contact) => {
              const isSelected = activeChatId === contact.id;
              const isKrishiQ = contact.id === 'krishiq';

              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveChatId(contact.id);
                    setShowMobileSidebar(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition select-none ${
                    isSelected
                      ? 'bg-[#F0F2F5] border-l-4 border-[#00A884]'
                      : 'hover:bg-[#F5F6F6] bg-white'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {contact.avatarUrl ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#075E54] shadow-xs flex items-center justify-center">
                        <Image
                          src={contact.avatarUrl}
                          alt={contact.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs ${
                          contact.avatarBg || 'bg-slate-600'
                        }`}
                      >
                        {contact.isGroup ? (
                          <Users className="w-5 h-5 text-white" />
                        ) : (
                          contact.avatarInitials || contact.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    )}

                    {/* Online Dot */}
                    {contact.onlineStatus === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-white" />
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3
                          className={`text-sm truncate ${
                            isSelected ? 'font-bold text-[#111B21]' : 'font-semibold text-[#111B21]'
                          }`}
                        >
                          {contact.name}
                        </h3>
                        {contact.isVerified && <VerifiedBadge size={14} />}
                      </div>
                      <span
                        className={`text-[11px] flex-shrink-0 ${
                          contact.unreadCount ? 'text-[#00A884] font-bold' : 'text-slate-400'
                        }`}
                      >
                        {isKrishiQ && isTyping ? 'typing...' : contact.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-[#54656F] truncate flex-1">
                        {isKrishiQ && isTyping ? (
                          <span className="text-[#00A884] font-medium">typing...</span>
                        ) : isKrishiQ && messages.length > 0 ? (
                          messages[messages.length - 1].passData ? (
                            `🎟️ Digital Gate Pass ${messages[messages.length - 1].passData?.passCode} Issued`
                          ) : messages[messages.length - 1].verificationCard ? (
                            `✅ AgriStack Verified: ${messages[messages.length - 1].verificationCard?.farmerName}`
                          ) : messages[messages.length - 1].voiceNote ? (
                            `🎤 Voice note (${messages[messages.length - 1].voiceNote?.duration})`
                          ) : (
                            messages[messages.length - 1].text.replace(/\n+/g, ' ')
                          )
                        ) : (
                          contact.lastMessage
                        )}
                      </p>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {contact.isPinned && (
                          <Pin className="w-3.5 h-3.5 text-slate-400 rotate-45" />
                        )}
                        {contact.unreadCount ? (
                          <span className="w-5 h-5 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                            {contact.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-3 bg-[#FAF8F5] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-[#00A884]" />
              AgriStack e-Gate Pass Verified
            </span>
            <span className="text-[10px] font-mono text-slate-400">APMC v2.4</span>
          </div>
        </aside>

        {/* 2. RIGHT CHAT WINDOW (Switches between KrishiQ interactive bot and static dummy chats) */}
        {activeChatId === 'krishiq' ? (
          <section className="relative flex-1 flex flex-col h-full bg-[#EFEAE2] overflow-hidden">
            {/* KrishiQ WhatsApp Header */}
            <WhatsAppHeader
              language={selectedLanguage}
              isTyping={isTyping}
              onSelectLanguage={(lang: SupportedLanguage) => setSelectedLanguage(lang)}
              onReset={resetFlow}
              onBackToChatList={() => setShowMobileSidebar(true)}
            />

            {/* Chat Background & Message Area */}
            <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
              <WhatsAppBackground />
              <MessageList
                messages={messages}
                language={selectedLanguage}
                isTyping={isTyping}
                onPillClick={(val) => handleUserSend(val)}
                onReset={resetFlow}
              />
            </div>

            {/* Input Bar */}
            <WhatsAppInputBar
              language={selectedLanguage}
              onSendMessage={(text, isVoice) => handleUserSend(text, isVoice)}
              disabled={isTyping}
            />
          </section>
        ) : activeDummyContact ? (
          <DummyChatView
            contact={activeDummyContact}
            onBackToChatList={() => setShowMobileSidebar(true)}
            onSwitchToKrishiQ={() => {
              setActiveChatId('krishiq');
              setShowMobileSidebar(false);
            }}
          />
        ) : null}
      </div>
    </main>
  );
};
