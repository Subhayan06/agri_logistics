'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GatePassData, SupportedLanguage } from '@/types/chat';
import { TRANSLATIONS } from '@/lib/translations';
import { Download, Share2, CheckCircle2, RotateCcw, ShieldCheck, MapPin, Calendar, Clock, Hash, Sprout, Scale, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MandiDirectionsModal } from './MandiDirectionsModal';

interface GatePassCardProps {
  passData: GatePassData;
  language: SupportedLanguage;
  onReset: () => void;
}

export const GatePassCard: React.FC<GatePassCardProps> = ({ passData, language, onReset }) => {
  const t = TRANSLATIONS[language]?.passCard || TRANSLATIONS.en.passCard;
  const [copied, setCopied] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#075E54', '#25D366', '#128C7E', '#FFD166', '#FFFFFF'],
      });
    } catch {
      // Ignore in environments without canvas support
    }
  }, []);

  const handleShare = async () => {
    const shareText = `*KrishiQ Official Mandi Gate Pass*\nPass Code: ${passData.passCode}\nFarmer ID: ${passData.agriStackId}\nCrop: ${passData.crop} (${passData.quantity})\nMandi: ${passData.mandi}\nSlot: ${passData.slot}\nStatus: VERIFIED & CONFIRMED`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KrishiQ Mandi e-Gate Pass',
          text: shareText,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard failed
    }
  };

  const handleDownload = () => {
    // Generate text/html slip for printing or saving
    const printContent = `
KRISHIQ OFFICIAL MANDI e-GATE PASS
----------------------------------------
Pass Code:     ${passData.passCode}
AgriStack ID:  ${passData.agriStackId}
Crop:          ${passData.crop}
Quantity:      ${passData.quantity}
APMC Mandi:    ${passData.mandi}
Slot:          ${passData.slot}
Issued At:     ${new Date(passData.issuedAt).toLocaleString()}
Status:        VERIFIED & AUTHORIZED
----------------------------------------
Ministry of Agriculture & Farmers Welfare
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([printContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `KrishiQ-GatePass-${passData.passCode}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="mt-3 w-full max-w-[340px] sm:max-w-[370px] bg-white rounded-xl shadow-lg border-2 border-[#128C7E40] overflow-hidden text-[#111B21] transition-all">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white p-3 sm:p-3.5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/15 p-1 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-5 h-5 text-[#A7F3D0]" />
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-[#A7F3D0] block">
                {t.badge}
              </span>
              <h4 className="text-xs sm:text-sm font-black tracking-wide leading-tight text-white">
                {t.passTitle}
              </h4>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#25D366] text-[#075E54] shadow-sm uppercase tracking-wider">
            ACTIVE
          </span>
        </div>
        <p className="text-[9px] text-white/80 mt-1 font-medium">
          {t.department}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-3 bg-gradient-to-b from-[#FAF8F5] to-white relative">
        {/* Pass Code Highlight Bar */}
        <div className="flex items-center justify-between bg-[#E7F7E9] border border-[#25D36660] rounded-lg px-3 py-2">
          <div>
            <span className="text-[10px] text-[#075E54] font-semibold uppercase block">
              {t.passCodeLabel}
            </span>
            <span className="text-base font-black tracking-wider text-[#075E54] font-mono">
              {passData.passCode}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">
              {t.statusLabel}
            </span>
            <span className="text-[11px] font-bold text-[#008069] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
              {t.statusValue}
            </span>
          </div>
        </div>

        {/* Dynamic Scannable QR Code */}
        <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-lg border border-dashed border-[#CBD5E1] shadow-inner relative">
          {passData.qrPayload ? (
            <div className="relative p-1 bg-white rounded border border-slate-200 shadow-sm">
              <Image
                src={passData.qrPayload}
                alt="Gate Pass QR Code"
                width={170}
                height={170}
                className="w-36 h-36 sm:w-40 sm:h-40 mx-auto"
                unoptimized
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center p-0.5 border border-emerald-600">
                  <span className="text-[10px] font-black text-[#075E54]">KQ</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-36 h-36 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
              Generating QR...
            </div>
          )}
          <p className="text-[9px] text-center text-slate-500 mt-1.5 font-medium px-2 leading-tight">
            {t.instructionText}
          </p>
        </div>

        {/* Farmer & Harvest Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded-md border border-slate-200">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
              <Hash className="w-3 h-3 text-[#075E54]" />
              <span>{t.farmerIdLabel}</span>
            </div>
            <p className="font-bold text-slate-900 font-mono truncate">{passData.agriStackId}</p>
            {passData.farmerName && (
              <span className="text-[10.5px] text-[#075E54] font-semibold truncate block">
                {passData.farmerName}
              </span>
            )}
          </div>

          <div className="bg-white p-2 rounded-md border border-slate-200">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
              <Sprout className="w-3 h-3 text-emerald-600" />
              <span>{t.cropLabel}</span>
            </div>
            <p className="font-bold text-slate-900">{passData.crop}</p>
          </div>

          <div className="bg-white p-2 rounded-md border border-slate-200">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
              <Scale className="w-3 h-3 text-amber-600" />
              <span>{t.quantityLabel}</span>
            </div>
            <p className="font-bold text-slate-900">{passData.quantity}</p>
          </div>

          <div className="bg-white p-2 rounded-md border border-slate-200">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mb-0.5">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>{t.mandiLabel}</span>
            </div>
            <p className="font-bold text-slate-900 truncate" title={passData.mandi}>
              {passData.mandi}
            </p>
          </div>
        </div>

        {/* Allocated Slot Bar */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-2 rounded-md flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 rounded text-amber-800">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-amber-900 block">
              {t.slotLabel}
            </span>
            <span className="text-xs font-bold text-amber-950">
              {passData.slot}
            </span>
          </div>
        </div>

        {/* Verified Stamp Badge */}
        <div className="pt-1 flex items-center justify-between border-t border-dashed border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#075E54] flex items-center justify-center text-white text-[10px]">
              ✓
            </div>
            <span className="text-[10px] font-black text-[#075E54] tracking-tight uppercase">
              {t.verifiedText}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">
            {new Date(passData.issuedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons: Download & Share */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#075E54] hover:bg-[#054c44] text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-slate-50 text-[#075E54] border border-[#075E54] text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : t.shareBtn}</span>
          </button>
        </div>

        {/* Directions to Gate Button (WhatsApp interactive pill/button styling) */}
        <button
          type="button"
          onClick={() => setIsDirectionsOpen(true)}
          className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#E7F7E9] hover:bg-[#D9FDD3] text-[#075E54] border border-[#25D366] text-xs font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-[#075E54]" />
          <span>{t.directionsBtn}</span>
        </button>

        {/* Book Another Pass Button */}
        <button
          type="button"
          onClick={onReset}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.bookAnotherBtn}</span>
        </button>
      </div>

      {/* Mandi Directions & Gate Navigation Modal */}
      <MandiDirectionsModal
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
        mandiName={passData.mandi}
        language={language}
      />
    </div>
  );
};
