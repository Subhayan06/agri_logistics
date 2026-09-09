'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Scale,
  Truck,
  Check,
  Flag,
  FileCheck2,
  SlidersHorizontal,
} from 'lucide-react';
import { OfficerQrScanner } from './OfficerQrScanner';
import {
  getLatestPass,
  getGateLogs,
  appendGateLog,
  VerifiedPassDetails,
  GateLogEntry,
  DEFAULT_DEMO_PASS,
} from '@/lib/passStore';
import {
  AGRISTACK_FARMER_DATASET,
  getRandomIntakeProfile,
  lookupAgriStackProfile,
  AgriStackFarmerProfile,
} from '@/lib/agristackDataset';
import { playAccessAuthorizedSound, playAlertSound } from '@/lib/sound';

export type SupervisorMode = 'sequential' | 'override_cleared' | 'flag_discrepancy';

/**
 * Strips any internal or simulated suffixes (like '(SIM)') from display strings.
 */
export const sanitizePassCode = (code?: string): string =>
  (code || '').replace(/\s*\(SIM\)/gi, '').trim();

export interface ComplianceResult {
  isApproved: boolean;
  status: 'CLEARED' | 'FLAGGED';
  bannerTitle: string;
  bannerSubtitle: string;
  landholding: string;
  yieldLimit: string;
  inboundLoad: string;
  statusText: string;
  warningSubtext?: string;
  quotaPercent: number;
  passCode: string;
  profile: AgriStackFarmerProfile;
}

interface OfficerDashboardProps {
  isSplitMode?: boolean;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ isSplitMode = false }) => {
  const [activeGate, setActiveGate] = useState<string>('Gate #3 - Heavy Unloading');
  const [manualSearchId, setManualSearchId] = useState<string>('');
  const [currentPass, setCurrentPass] = useState<VerifiedPassDetails>(DEFAULT_DEMO_PASS);
  const [activeQueueStatus, setActiveQueueStatus] = useState<'READY' | 'CLEARED' | 'FLAGGED'>('READY');
  const [verifiedModalPass, setVerifiedModalPass] = useState<VerifiedPassDetails | null>(null);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [supervisorMode, setSupervisorMode] = useState<SupervisorMode>('sequential');
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [gateLogs, setGateLogs] = useState<GateLogEntry[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load initial pass and logs + listen for realtime events from Farmer chat
  useEffect(() => {
    const pass = getLatestPass();
    setCurrentPass(pass);
    setGateLogs(getGateLogs());

    const handlePassIssued = (e: Event) => {
      const customEvent = e as CustomEvent<VerifiedPassDetails>;
      if (customEvent.detail) {
        setCurrentPass(customEvent.detail);
        setActiveQueueStatus('READY');
      }
    };

    const handleLogAppended = (e: Event) => {
      const customEvent = e as CustomEvent<GateLogEntry[]>;
      if (customEvent.detail) {
        setGateLogs(customEvent.detail);
      }
    };

    window.addEventListener('krishiq_pass_issued', handlePassIssued);
    window.addEventListener('krishiq_log_appended', handleLogAppended);

    return () => {
      window.removeEventListener('krishiq_pass_issued', handlePassIssued);
      window.removeEventListener('krishiq_log_appended', handleLogAppended);
    };
  }, []);

  /**
   * Generates dynamic mock scan from the 15-profile pool,
   * performs 50/50 compliance evaluation, updates the Active Inbound Queue card,
   * prepends to Recent Scanned Vehicles Log, and opens the Verification Modal.
   */
  const handleVerifyPass = (searchQuery?: string) => {
    const query = (searchQuery || manualSearchId || '').trim();

    // 1. Resolve Farmer Profile from the 15-profile dataset
    let profile: AgriStackFarmerProfile;
    if (query) {
      profile = lookupAgriStackProfile(query);
    } else {
      profile = getRandomIntakeProfile();
    }

    // 2. Generate auto-generated Pass ID (RQ-XXXX-IN format)
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const rawPassCode =
      query && query.toUpperCase().startsWith('RQ-') && query.toUpperCase().includes('-IN')
        ? query.toUpperCase()
        : `RQ-${randomCodeNum}-IN`;
    const passCode = sanitizePassCode(rawPassCode);

    // 3. Evaluate 50/50 approval logic & acreage threshold (<15 Qtl/Acre)
    let isApproved = true;
    if (supervisorMode === 'override_cleared') {
      isApproved = true;
    } else if (supervisorMode === 'flag_discrepancy') {
      isApproved = false;
    } else {
      // Exact ~50/50 probability split
      isApproved = Math.random() < 0.5;
    }

    const acreage = profile.acreage || 3.2;
    // Permissible baseline cap at 15 Qtl/Acre
    const maxPermissibleCapQtl = Math.round(acreage * 15);

    let inboundLoadText: string;
    let numericInboundQtl: number;
    let quotaPercent: number;

    if (isApproved) {
      // 50% "VERIFIED / CLEARED": Weight conforms to registered acreage limit (<15 Qtl/Acre)
      // If Dilip Mahato (2.1 acres, default weight 40 Qtl > 31.5 Qtl cap), normalize to 24 Qtl for CLEARED
      if (profile.agriStackId === 'AS-WB-9340') {
        inboundLoadText = '24 Quintals (48 Bags)';
        numericInboundQtl = 24.0;
      } else {
        inboundLoadText = profile.weight;
        const parsed = parseFloat(profile.weight);
        numericInboundQtl = isNaN(parsed) ? Math.round(acreage * 8.5) : parsed;
      }
      quotaPercent = Math.min(94, Math.round((numericInboundQtl / maxPermissibleCapQtl) * 100));
    } else {
      // 50% "FLAGGED / DISCREPANCY": Acreage Yield Threshold Exceeded (>15 Qtl/Acre)
      const excessQtl = Math.round(acreage * 23);
      const excessBags = Math.round(excessQtl * 2);
      inboundLoadText = `${excessQtl} Quintals (${excessBags} Bags)`;
      numericInboundQtl = excessQtl;
      quotaPercent = Math.round((excessQtl / maxPermissibleCapQtl) * 100);
    }

    const assignedGate = activeGate.split(' - ')[0] || 'Gate #3';
    const primaryMandi = profile.mandis[0] || 'Burdwan Central APMC';

    // 4. Construct Compliance Result
    const evaluation: ComplianceResult = {
      isApproved,
      status: isApproved ? 'CLEARED' : 'FLAGGED',
      bannerTitle: isApproved
        ? 'GATE ENTRY AUTHORIZED ✅'
        : 'FLAGGED: Quota Exceeded (Anti-Hoarding Alert)',
      bannerSubtitle: isApproved
        ? `AgriStack Land Quota Verified • Within Limit (<15 Qtl/Acre) • ${profile.name} (${profile.agriStackId})`
        : `Yield exceeds registered acreage limit (>15 Qtl/Acre) • ${profile.name} (${profile.agriStackId})`,
      landholding: `${acreage} Acres (${profile.block})`,
      yieldLimit: `<15 Qtl/Acre Threshold (${maxPermissibleCapQtl} Quintals Max)`,
      inboundLoad: inboundLoadText,
      statusText: isApproved
        ? `Quota Safe (${quotaPercent}% of seasonal quota utilized)`
        : `ALERT: EXCEEDS MAXIMUM HARVEST CAP (${quotaPercent}% Over Quota)`,
      warningSubtext: isApproved
        ? undefined
        : `⚠️ Discrepancy Detected: Declared harvest exceeds maximum biological yield threshold (15 Qtl/Acre) for registered land acreage by ${Math.max(1, quotaPercent - 100)}%. Flagged for anti-hoarding audit.`,
      quotaPercent,
      passCode,
      profile,
    };

    // 5. Update Active Gate Inbound Queue Card
    const updatedPass: VerifiedPassDetails = {
      passCode,
      token: passCode.replace('-IN', ''),
      agriStackId: profile.agriStackId,
      farmerName: profile.name,
      landholding: `${acreage} Acres`,
      block: profile.block,
      crop: profile.crop,
      quantity: inboundLoadText,
      mandi: primaryMandi,
      slot: `Designated Inbound • ${assignedGate}`,
      issuedAt: new Date().toISOString(),
      qrPayload: JSON.stringify({ id: profile.agriStackId, pass: passCode, crop: profile.crop }),
      status: isApproved ? 'ACTIVE' : 'FLAGGED',
      landLimit: `<15 Qtl/Acre Cap (${maxPermissibleCapQtl} Qtl Max)`,
      inboundQtl: numericInboundQtl,
      maxQuotaQtl: maxPermissibleCapQtl,
      flagReason: isApproved ? undefined : 'Yield Exceeds Permissible Acreage Cap (15 Qtl/Acre)',
    };

    setCurrentPass(updatedPass);
    setActiveQueueStatus(isApproved ? 'CLEARED' : 'FLAGGED');

    // 6. Prepend the new transaction to the Recent Inbound Scanned Vehicles Log
    const newLog: GateLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      passCode,
      agriStackId: profile.agriStackId,
      crop: profile.crop,
      weight: inboundLoadText,
      mandi: primaryMandi,
      status: isApproved ? 'CLEARED' : 'FLAGGED',
      gate: assignedGate,
    };

    const updatedLogs = appendGateLog(newLog);
    setGateLogs(updatedLogs);

    // 7. Open Gate Verification Modal & trigger audio cue
    setComplianceResult(evaluation);
    setVerifiedModalPass(updatedPass);
    setVerificationFeedback(null);
    setManualSearchId('');

    if (isApproved) {
      playAccessAuthorizedSound();
    } else {
      playAlertSound();
    }
  };

  // Handle Gate Approval Action (Approved Branch)
  const handleApproveEntry = () => {
    if (!verifiedModalPass) return;

    const updatedPass: VerifiedPassDetails = {
      ...verifiedModalPass,
      status: 'USED',
      weighbridgeAssigned: 'Weighbridge #2 (Gross Weighment)',
      clearedAt: new Date().toISOString(),
    };
    setCurrentPass(updatedPass);
    setActiveQueueStatus('CLEARED');
    setVerificationFeedback('Gate Entry Approved • Dispatched to Weighbridge #2');
    playAccessAuthorizedSound();

    setTimeout(() => {
      setVerifiedModalPass(null);
      setVerificationFeedback(null);
    }, 1600);
  };

  // Handle Divert to Inspection (Flagged Branch - Primary)
  const handleDivertInspection = () => {
    if (!verifiedModalPass) return;

    const updatedPass: VerifiedPassDetails = {
      ...verifiedModalPass,
      status: 'FLAGGED',
      flagReason: 'Exceeds Permissible Acreage Cap (Audit Required)',
    };
    setCurrentPass(updatedPass);
    setActiveQueueStatus('FLAGGED');
    setVerificationFeedback('Vehicle Diverted to Inbound Inspection Bay #1');
    playAlertSound();

    setTimeout(() => {
      setVerifiedModalPass(null);
      setVerificationFeedback(null);
    }, 1600);
  };

  // Handle SDM Exemption Override (Flagged Branch - Secondary)
  const handleSdmOverride = () => {
    if (!verifiedModalPass) return;

    const newLog: GateLogEntry = {
      id: `log-${Date.now()}-sdm`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      passCode: `${verifiedModalPass.passCode} (SDM)`,
      agriStackId: verifiedModalPass.agriStackId,
      crop: verifiedModalPass.crop,
      weight: verifiedModalPass.quantity,
      mandi: verifiedModalPass.mandi,
      status: 'CLEARED',
      gate: activeGate.split(' - ')[0],
    };

    const updated = appendGateLog(newLog);
    setGateLogs(updated);

    const updatedPass: VerifiedPassDetails = {
      ...verifiedModalPass,
      status: 'USED',
      weighbridgeAssigned: 'Weighbridge #1 (Special Exemption)',
      clearedAt: new Date().toISOString(),
    };
    setCurrentPass(updatedPass);
    setActiveQueueStatus('CLEARED');
    setVerificationFeedback('SDM Exemption Authorized • Weighbridge #1 Assigned');
    playAccessAuthorizedSound();

    setTimeout(() => {
      setVerifiedModalPass(null);
      setVerificationFeedback(null);
    }, 1600);
  };

  return (
    <div className="relative w-full h-full bg-slate-100 text-slate-800 flex flex-col overflow-hidden font-sans border border-slate-200 select-none">
      {/* 1. TOP INSTITUTIONAL BAR (DEEP NAVY: bg-[#0a2540]) */}
      <header className="bg-[#0a2540] border-b border-[#071d33] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white shadow-xs z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Official Emblem / Logo Container */}
          <div className="w-9 h-9 rounded bg-[#071d33] p-1 flex items-center justify-center flex-shrink-0 border border-blue-900/60 shadow-xs">
            <Image
              src="/logo.png"
              alt="APMC Emblem"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80">
                GOVT. OF INDIA • APMC
              </span>
              <span className="text-[11px] text-blue-300/80 font-mono hidden sm:inline">
                TERM-ID: WB-BWD-WB02
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight mt-0.5">
              राष्ट्रीय कृषि बाजार (e-NAM) • APMC Electronic Gate Intake Terminal | Yard #04
            </h2>
          </div>
        </div>

        {/* Right Header Status Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Live System Status Pill */}
          <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>System Online • Offline Buffer Ready</span>
          </div>

          {/* Gate Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#13395e] border border-blue-900/80 rounded px-2.5 py-1 text-xs text-white">
            <MapPin className="w-3.5 h-3.5 text-blue-300" />
            <select
              value={activeGate}
              onChange={(e) => setActiveGate(e.target.value)}
              className="bg-transparent text-white outline-none font-medium cursor-pointer text-xs"
            >
              <option value="Gate #3 - Heavy Unloading" className="bg-[#0a2540] text-white">
                Gate #3 - Heavy Unloading
              </option>
              <option value="Gate #1 - Mini Trucks / LCV" className="bg-[#0a2540] text-white">
                Gate #1 - Mini Trucks / LCV
              </option>
              <option value="Gate #2 - Commercial Carriers" className="bg-[#0a2540] text-white">
                Gate #2 - Commercial Carriers
              </option>
              <option value="Gate #4 - Outbound Empty" className="bg-[#0a2540] text-white">
                Gate #4 - Outbound Empty
              </option>
            </select>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-[#13395e] px-2.5 py-1 rounded border border-blue-900/80 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span>{currentTime || '11:00:00 PM'}</span>
          </div>
        </div>
      </header>

      {/* 2. CENTRAL SCANNER & VERIFICATION CORE */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start max-w-6xl mx-auto">
          {/* Left / Top: Optical Document Scanner Column (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <OfficerQrScanner
              onScanSuccess={(code) => handleVerifyPass(code)}
              onSimulateScan={() => handleVerifyPass()}
              simulatedPassCode={currentPass.passCode}
            />
          </div>

          {/* Right: Supervisor Controls, Manual Search & Active Gate Inbound Queue (7 cols) */}
          <div className="lg:col-span-7 space-y-3 w-full">
            {/* Professional Supervisor Controls Strip */}
            <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Supervisor Controls
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Intake Queue & Verification Mode
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSupervisorMode('sequential')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    supervisorMode === 'sequential'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Sequential Gate Ingress"
                >
                  Sequential Gate Ingress
                </button>
                <button
                  type="button"
                  onClick={() => setSupervisorMode('override_cleared')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                    supervisorMode === 'override_cleared'
                      ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title="Manual Supervisor Override"
                >
                  <Check className="w-3 h-3" />
                  <span>Manual Supervisor Override</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSupervisorMode('flag_discrepancy')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                    supervisorMode === 'flag_discrepancy'
                      ? 'bg-rose-700 text-white shadow-xs font-semibold'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                  title="Flag Discrepancy"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Flag Discrepancy</span>
                </button>
              </div>
            </div>

            {/* Instant Manual Pass Search */}
            <div className="bg-white border border-slate-200 rounded p-3.5 shadow-xs">
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block uppercase tracking-wider">
                Instant Manual Pass Search
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualSearchId}
                    onChange={(e) => setManualSearchId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerifyPass();
                    }}
                    placeholder="Enter Pass ID or Farmer ID (e.g., RQ-8765-IN / AS-PB-1194)"
                    className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-mono focus:bg-white focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] outline-none transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifyPass()}
                  className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold text-xs rounded shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </div>

            {/* Active Gate Inbound Queue Card */}
            <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 flex-wrap gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Active Gate Inbound Queue</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Status Chip */}
                  {activeQueueStatus === 'CLEARED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-600" />
                      VERIFIED / CLEARED
                    </span>
                  )}
                  {activeQueueStatus === 'FLAGGED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      FLAGGED: Quota Exceeded
                    </span>
                  )}
                  {activeQueueStatus === 'READY' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      GATE QUEUE READY
                    </span>
                  )}

                  <span className="text-[11px] font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    PASS: {sanitizePassCode(currentPass.passCode)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-3">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Farmer Profile</span>
                  <span className="font-bold text-slate-900 truncate block">
                    {currentPass.farmerName || 'Rameshwar Mondal'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {currentPass.agriStackId}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Crop</span>
                  <span className="font-bold text-slate-900 truncate block">{currentPass.crop}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Inbound Weight</span>
                  <span
                    className={`font-bold truncate block ${
                      activeQueueStatus === 'FLAGGED' ? 'text-rose-700' : 'text-amber-800'
                    }`}
                  >
                    {currentPass.quantity}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Mandi APMC</span>
                  <span className="font-bold text-slate-900 truncate block">{currentPass.mandi}</span>
                </div>
              </div>

              {/* Anti-Hoarding Yield Baseline Strip */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-600" />
                    <span>AgriStack Landholding & Acreage Limit (&lt;15 Qtl/Acre):</span>
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      activeQueueStatus === 'FLAGGED' ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    {currentPass.landLimit || 'Cap: 65 Qtl Max'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Registered Landholding:{' '}
                  <strong className="text-slate-900">
                    {currentPass.landholding || '3.2 Acres'} ({currentPass.block || 'Burdwan Block'})
                  </strong>{' '}
                  | Inbound Load:{' '}
                  <strong
                    className={activeQueueStatus === 'FLAGGED' ? 'text-rose-800' : 'text-amber-800'}
                  >
                    {currentPass.quantity}
                  </strong>
                </p>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeQueueStatus === 'FLAGGED' ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(12, (currentPass.inboundQtl / currentPass.maxQuotaQtl) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. GATE VERIFICATION AUDIT MODAL (Triggered upon scan or verification) */}
        {verifiedModalPass && complianceResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              className={`relative w-full max-w-[530px] bg-white rounded-lg border ${
                complianceResult.isApproved ? 'border-emerald-500' : 'border-rose-500'
              } shadow-xl overflow-hidden text-slate-900 animate-in zoom-in-95 duration-150`}
            >
              {/* Top Banner */}
              <div
                className={`px-4 py-3 flex items-center justify-between text-white ${
                  complianceResult.isApproved ? 'bg-emerald-700' : 'bg-rose-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    {complianceResult.isApproved ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase leading-tight">
                      {complianceResult.bannerTitle}
                    </h3>
                    <span className="text-[10px] text-white/90 block font-normal">
                      {complianceResult.bannerSubtitle}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-slate-900 shadow-xs flex-shrink-0">
                  {complianceResult.isApproved ? 'WITHIN QUOTA' : 'FLAGGED'}
                </span>
              </div>

              {/* Feedback toast if button clicked */}
              {verificationFeedback && (
                <div
                  className={`border-b px-4 py-2 text-center text-xs font-bold ${
                    complianceResult.isApproved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {verificationFeedback}
                </div>
              )}

              {/* Farmer & Harvest Details Grid */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Pass Code</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {sanitizePassCode(verifiedModalPass.passCode)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Farmer Name & ID</span>
                    <span className="text-xs font-bold text-slate-900 flex flex-col font-mono">
                      <span className="truncate">
                        {verifiedModalPass.farmerName
                          ? `${verifiedModalPass.farmerName} • ${verifiedModalPass.agriStackId}`
                          : verifiedModalPass.agriStackId}
                      </span>
                      {complianceResult.isApproved ? (
                        <span className="text-emerald-700 text-[10.5px] font-sans font-medium">AgriStack Verified ✅</span>
                      ) : (
                        <span className="text-rose-700 text-[10.5px] font-sans font-medium">⚠️ Audit Flagged</span>
                      )}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Declared Crop</span>
                    <span className="font-semibold text-slate-900 truncate block">
                      🌾 {verifiedModalPass.crop}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Inbound Load</span>
                    <span
                      className={`font-bold truncate block ${
                        complianceResult.isApproved ? 'text-amber-800' : 'text-rose-700'
                      }`}
                    >
                      ⚖️ {complianceResult.inboundLoad}
                    </span>
                  </div>
                </div>

                {/* Anti-Hoarding Yield Check Panel */}
                <div
                  className={`border rounded p-3 text-xs space-y-2 ${
                    complianceResult.isApproved
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-rose-50/50 border-rose-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Scale
                        className={`w-4 h-4 ${
                          complianceResult.isApproved ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      />
                      <span>AgriStack Land-to-Yield Compliance Check:</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        complianceResult.isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {complianceResult.isApproved ? 'Quota Safe' : 'Excess Yield'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11.5px] pt-1">
                    <p>
                      <span className="text-slate-500">AgriStack Landholding: </span>
                      <strong className="text-slate-800">{complianceResult.landholding}</strong>
                    </p>
                    <p>
                      <span className="text-slate-500">
                        {complianceResult.isApproved
                          ? 'Permissible Cap (<15 Qtl/Acre): '
                          : 'Permissible Harvest Cap: '}
                      </span>
                      <strong
                        className={complianceResult.isApproved ? 'text-emerald-800' : 'text-rose-800'}
                      >
                        {complianceResult.yieldLimit}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-600">
                      Inbound Cargo: <strong className="text-slate-800">{complianceResult.inboundLoad}</strong>
                    </span>
                    <span
                      className={
                        complianceResult.isApproved
                          ? 'text-emerald-700 font-bold'
                          : 'text-rose-700 font-bold'
                      }
                    >
                      {complianceResult.statusText}
                    </span>
                  </div>

                  {/* Quota Gauge Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        complianceResult.isApproved ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(10, complianceResult.quotaPercent))}%` }}
                    />
                  </div>

                  {/* Warning Subtext callout box if Flagged */}
                  {!complianceResult.isApproved && complianceResult.warningSubtext && (
                    <div className="mt-2 p-2.5 bg-rose-100/70 border border-rose-300 rounded text-rose-900 text-[11px] leading-relaxed">
                      {complianceResult.warningSubtext}
                    </div>
                  )}
                </div>

                {/* Gate Action Buttons */}
                <div className="space-y-2 pt-1">
                  {complianceResult.isApproved ? (
                    <button
                      type="button"
                      onClick={handleApproveEntry}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded shadow-xs flex items-center justify-center gap-2 transition active:scale-98"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve Gate Entry & Assign Weighbridge #2</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleDivertInspection}
                        className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded shadow-xs flex items-center justify-center gap-2 transition active:scale-98"
                      >
                        <Flag className="w-4 h-4" />
                        <span>Divert to Physical Inspection Bay #1</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSdmOverride}
                        className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <span>Authorize with SDM Exemption</span>
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setVerifiedModalPass(null)}
                    className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition active:scale-95 text-center"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. RECENT INBOUND SCANNED VEHICLES LOG TABLE (Bottom of Officer View) */}
        <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#1E3A8A]" />
              <span>Recent Inbound Scanned Vehicles Log</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Live APMC Inbound Feed</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3.5">Time</th>
                  <th className="py-2.5 px-3.5">Pass ID</th>
                  <th className="py-2.5 px-3.5">AgriStack ID</th>
                  <th className="py-2.5 px-3.5">Crop</th>
                  <th className="py-2.5 px-3.5">Weight</th>
                  <th className="py-2.5 px-3.5">Gate</th>
                  <th className="py-2.5 px-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono bg-white">
                {gateLogs.slice(0, 6).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3.5 text-slate-500 font-sans">{log.timestamp}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">{sanitizePassCode(log.passCode)}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{log.agriStackId}</td>
                    <td className="py-2.5 px-3.5 font-sans text-slate-800 font-medium">{log.crop}</td>
                    <td className="py-2.5 px-3.5 text-slate-700 font-sans">{log.weight}</td>
                    <td className="py-2.5 px-3.5 text-slate-600 font-sans">{log.gate}</td>
                    <td className="py-2.5 px-3.5 font-sans">
                      {log.status === 'CLEARED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          CLEARED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          FLAGGED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
