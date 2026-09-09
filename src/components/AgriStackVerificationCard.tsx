'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2, MapPin, Scale, User, Award } from 'lucide-react';
import { VerificationCardData } from '@/types/chat';

interface AgriStackVerificationCardProps {
  data: VerificationCardData;
}

export const AgriStackVerificationCard: React.FC<AgriStackVerificationCardProps> = ({ data }) => {
  return (
    <div className="my-1.5 w-full max-w-[340px] sm:max-w-[380px] bg-gradient-to-b from-[#F0FDF4] to-[#FFFFFF] rounded-xl border border-[#86EFAC] p-3.5 shadow-sm text-slate-800 select-none">
      {/* Top Govt / AgriStack Seal Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCFCE7]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#075E54] p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Image
              src="/logo.png"
              alt="AgriStack Seal"
              width={26}
              height={26}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <div>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#15803D] block">
              Govt. of India • AgriStack
            </span>
            <span className="text-xs font-bold text-[#064E3B] flex items-center gap-1">
              <span>Land Registry Verified</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] fill-[#DCFCE7]" />
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full border border-[#86EFAC]">
          AUTHENTICATED
        </span>
      </div>

      {/* Main Verification Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-2.5">
        <div className="bg-white/90 p-2 rounded-lg border border-[#BBF7D0]">
          <span className="text-[10px] text-slate-500 block uppercase font-medium flex items-center gap-1">
            <User className="w-3 h-3 text-[#16A34A]" />
            <span>Farmer Name</span>
          </span>
          <span className="font-bold text-slate-900 truncate block">
            {data.farmerName || 'Rameshwar Mondal'}
          </span>
        </div>

        <div className="bg-white/90 p-2 rounded-lg border border-[#BBF7D0]">
          <span className="text-[10px] text-slate-500 block uppercase font-medium flex items-center gap-1">
            <Award className="w-3 h-3 text-[#16A34A]" />
            <span>AgriStack ID</span>
          </span>
          <span className="font-bold text-[#15803D] font-mono truncate block">
            {data.agriStackId.startsWith('#') || data.agriStackId.startsWith('AS-')
              ? data.agriStackId
              : `#${data.agriStackId}`}
          </span>
        </div>

        <div className="bg-white/90 p-2 rounded-lg border border-[#BBF7D0]">
          <span className="text-[10px] text-slate-500 block uppercase font-medium flex items-center gap-1">
            <Scale className="w-3 h-3 text-[#16A34A]" />
            <span>Verified Land</span>
          </span>
          <span className="font-bold text-slate-900 block">
            {data.landholding || '3.2 Acres'}
          </span>
        </div>

        <div className="bg-white/90 p-2 rounded-lg border border-[#BBF7D0]">
          <span className="text-[10px] text-slate-500 block uppercase font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#16A34A]" />
            <span>Location Block</span>
          </span>
          <span className="font-bold text-slate-900 truncate block">
            {data.location || 'Burdwan (WB)'}
          </span>
        </div>
      </div>

      {/* Quota & Trust Footer Banner */}
      <div className="bg-[#DCFCE7]/70 border border-[#86EFAC] rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px] text-[#14532D]">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>{data.quotaUtilized || 'Seasonal Quota Safe • 19.2% utilized'}</span>
        </div>
        <span className="text-[10px] font-mono font-semibold text-[#15803D]">
          Live Sync ✓
        </span>
      </div>
    </div>
  );
};
