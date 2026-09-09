'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, ExternalLink, MapPin, Navigation, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '@/types/chat';
import { TRANSLATIONS } from '@/lib/translations';

// Dynamically import Leaflet Map to avoid SSR window errors
const MandiMap = dynamic(() => import('./MandiMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-3">
      <div className="w-8 h-8 rounded-full border-3 border-[#075E54] border-t-transparent animate-spin" />
      <span className="text-xs font-medium">Loading Gate & Route Navigation...</span>
    </div>
  ),
});

interface MandiDirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mandiName: string;
  language: SupportedLanguage;
}

export const MandiDirectionsModal: React.FC<MandiDirectionsModalProps> = ({
  isOpen,
  onClose,
  mandiName,
  language,
}) => {
  const t = TRANSLATIONS[language]?.passCard || TRANSLATIONS.en.passCard;

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${mandiName} APMC`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Card Container */}
      <div
        className="relative w-full max-w-[540px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white px-4 py-3 sm:py-3.5 flex items-start justify-between relative shadow-md">
          <div className="flex items-start gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-full bg-white/15 p-1.5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
              <Navigation className="w-4 h-4 text-[#A7F3D0]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                  {mandiName}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#25D366] text-[#075E54] uppercase flex-shrink-0">
                  APMC
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#A7F3D0] font-medium leading-snug mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t.designatedEntry}</span>
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close directions modal"
            className="p-1.5 -mr-1 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition active:scale-95 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader info bar */}
        <div className="bg-[#FAF8F5] px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#075E54]" />
            <span className="font-semibold text-slate-800">Express Gate Pass Priority Entry</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Lane #2 (Loaded Trucks)</span>
        </div>

        {/* Map View Section */}
        <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-100 flex-1 min-h-[280px]">
          <MandiMap
            mandiName={mandiName}
            liveGateStatusText={t.liveGateStatus}
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="text-[11px] text-slate-500 text-center sm:text-left leading-tight hidden sm:block">
            Show this map to the gate marshal for expedited weighment routing.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition active:scale-95"
            >
              {t.closeBtn}
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#075E54] hover:bg-[#054c44] text-white text-xs font-bold rounded-lg shadow-md transition active:scale-95"
            >
              <span>{t.openInGoogleMaps}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
