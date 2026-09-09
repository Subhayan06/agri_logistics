import { GatePassData } from '@/types/chat';

export interface VerifiedPassDetails extends GatePassData {
  status: 'ACTIVE' | 'USED' | 'FLAGGED';
  landLimit: string;
  inboundQtl: number;
  maxQuotaQtl: number;
  weighbridgeAssigned?: string;
  clearedAt?: string;
  flagReason?: string;
}

export interface GateLogEntry {
  id: string;
  timestamp: string;
  passCode: string;
  agriStackId: string;
  crop: string;
  weight: string;
  mandi: string;
  status: 'CLEARED' | 'FLAGGED' | 'IN_WEIGHMENT';
  gate: string;
}

export const DEFAULT_DEMO_PASS: VerifiedPassDetails = {
  passCode: 'RQ-8765-UL',
  token: 'RQ-8765',
  agriStackId: 'AS-WB-8762',
  farmerName: 'Rameshwar Mondal',
  landholding: '3.2 Acres',
  block: 'Burdwan II (WB)',
  crop: 'Wheat (गेहूं)',
  quantity: '20 Quintals (~40 Bags)',
  mandi: 'Burdwan Central APMC',
  slot: 'Today, 08:30 AM - 10:30 AM',
  issuedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  qrPayload: '',
  status: 'ACTIVE',
  landLimit: '65 Qtl (3.2 Acres Verified)',
  inboundQtl: 20.0,
  maxQuotaQtl: 65.0,
};

export const INITIAL_GATE_LOGS: GateLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '10:48 AM',
    passCode: 'RQ-7124-IN',
    agriStackId: 'AS-PB-1194',
    crop: 'Paddy (PR-126)',
    weight: '54 Quintals (108 Bags)',
    mandi: 'Ludhiana APMC Yard',
    status: 'CLEARED',
    gate: 'Gate #3',
  },
  {
    id: 'log-2',
    timestamp: '10:32 AM',
    passCode: 'RQ-5390-IN',
    agriStackId: 'AS-GJ-4421',
    crop: 'Castor Seeds',
    weight: '32 Quintals (64 Bags)',
    mandi: 'Anand Main APMC',
    status: 'CLEARED',
    gate: 'Gate #3',
  },
  {
    id: 'log-3',
    timestamp: '10:15 AM',
    passCode: 'RQ-3891-IN',
    agriStackId: 'AS-WB-9340',
    crop: 'Potato (Jyoti)',
    weight: '68 Quintals (136 Bags)',
    mandi: 'Burdwan Central APMC',
    status: 'FLAGGED',
    gate: 'Gate #3',
  },
];

const LOCAL_STORAGE_KEY = 'krishiq_latest_pass';
const LOCAL_STORAGE_LOGS = 'krishiq_gate_logs';

export function saveLatestPass(pass: GatePassData): VerifiedPassDetails {
  const verifiedPass: VerifiedPassDetails = {
    ...pass,
    farmerName: pass.farmerName || 'Rameshwar Mondal',
    landholding: pass.landholding || '3.2 Acres',
    block: pass.block || 'Burdwan II (WB)',
    status: 'ACTIVE',
    landLimit: pass.landholding ? `${pass.landholding} Verified` : '65 Qtl (3.2 Acres Verified)',
    inboundQtl: 20.0,
    maxQuotaQtl: 65.0,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(verifiedPass));
      window.dispatchEvent(
        new CustomEvent('krishiq_pass_issued', { detail: verifiedPass })
      );
    } catch {
      // Ignore
    }
  }
  return verifiedPass;
}

export function getLatestPass(): VerifiedPassDetails {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
  }
  return DEFAULT_DEMO_PASS;
}

export function getGateLogs(): GateLogEntry[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
  }
  return INITIAL_GATE_LOGS;
}

export function appendGateLog(log: GateLogEntry): GateLogEntry[] {
  const logs = getGateLogs();
  const updated = [log, ...logs.slice(0, 9)];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_LOGS, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent('krishiq_log_appended', { detail: updated })
      );
    } catch {
      // Ignore
    }
  }
  return updated;
}
