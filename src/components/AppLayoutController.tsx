'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Columns2, Smartphone, Monitor, Zap, ChevronDown, Check } from 'lucide-react';
import { WhatsAppShell } from './WhatsAppShell';
import { OfficerDashboard } from './OfficerDashboard';

export type ViewMode = 'farmer' | 'officer' | 'split';

export const AppLayoutController: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('farmer');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#0B1120] overflow-hidden select-none">
      {/* 1. TOP-LEFT VIEW MODE TOGGLE SWITCH (Fixed Floating Pill) */}
      <div className="fixed top-2.5 left-2.5 sm:left-4 z-[100]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="Toggle view mode"
          className="bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md shadow-2xl px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wide transition-all active:scale-95 group hover:border-emerald-500/50"
        >
          {viewMode === 'farmer' && (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">📱 Farmer View</span>
              <span className="xs:hidden">Farmer</span>
            </>
          )}
          {viewMode === 'officer' && (
            <>
              <Monitor className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden xs:inline">🖥️ Officer View</span>
              <span className="xs:hidden">Officer</span>
            </>
          )}
          {viewMode === 'split' && (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">⚡ Demo (Split 50/50)</span>
              <span className="xs:hidden">Split</span>
            </>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>

        {/* Sleek Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-10 left-0 w-64 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl py-1.5 text-slate-200 text-xs z-[110] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-lg">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800 mb-1">
              Select Workspace View
            </div>

            {/* Option 1: Farmer View */}
            <button
              type="button"
              onClick={() => {
                setViewMode('farmer');
                setDropdownOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between transition ${
                viewMode === 'farmer'
                  ? 'bg-emerald-950/60 text-emerald-300 font-bold'
                  : 'text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block font-semibold">📱 Farmer View</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    Full-screen WhatsApp chat interface
                  </span>
                </div>
              </div>
              {viewMode === 'farmer' && <Check className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Option 2: Officer View */}
            <button
              type="button"
              onClick={() => {
                setViewMode('officer');
                setDropdownOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between transition ${
                viewMode === 'officer'
                  ? 'bg-blue-950/60 text-blue-300 font-bold'
                  : 'text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="block font-semibold">🖥️ Officer View</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    Full-screen APMC Weighbridge terminal
                  </span>
                </div>
              </div>
              {viewMode === 'officer' && <Check className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Option 3: Demo Mode (Split 50/50) */}
            <button
              type="button"
              onClick={() => {
                setViewMode('split');
                setDropdownOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between transition ${
                viewMode === 'split'
                  ? 'bg-amber-950/60 text-amber-300 font-bold'
                  : 'text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="block font-semibold">⚡ Demo Mode (Split 50/50)</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    Farmer chat (left) + Officer scanner (right)
                  </span>
                </div>
              </div>
              {viewMode === 'split' && <Check className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        )}
      </div>

      {/* 2. RENDER SELECTED WORKSPACE VIEW */}
      {viewMode === 'farmer' && <WhatsAppShell />}

      {viewMode === 'officer' && (
        <div className="w-full h-screen">
          <OfficerDashboard />
        </div>
      )}

      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-screen p-3 bg-slate-950/20 backdrop-blur-sm overflow-hidden pt-12 sm:pt-3">
          {/* Left Pane: Farmer Chat */}
          <div className="h-full rounded-xl overflow-hidden shadow-2xl border border-slate-700/40 relative">
            <WhatsAppShell isSplitMode={true} />
          </div>

          {/* Right Pane: Officer Dashboard Scanner */}
          <div className="h-full rounded-xl overflow-hidden shadow-2xl border border-slate-700/40 relative">
            <OfficerDashboard isSplitMode={true} />
          </div>
        </div>
      )}
    </div>
  );
};
