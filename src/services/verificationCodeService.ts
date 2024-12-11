import { v4 as uuidv4 } from 'uuid';
import { VerificationCode, VerificationCodeStatus, VerificationCodeLog } from '../types/verificationCode';
import { UserRole } from '../types/user';

const CODES_STORAGE_KEY = 'verification_codes';
const LOGS_STORAGE_KEY = 'verification_code_logs';

function getStoredData(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateSecureCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const randomValues = new Uint32Array(8);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 8; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  return code;
}

function addLog(codeId: string, action: VerificationCodeLog['action'], details?: string) {
  const logs = getStoredData(LOGS_STORAGE_KEY);
  const log: VerificationCodeLog = {
    id: uuidv4(),
    codeId,
    action,
    timestamp: new Date().toISOString(),
    details
  };
  logs[log.id] = log;
  saveStoredData(LOGS_STORAGE_KEY, logs);
}

export async function generateCode(
  type: UserRole,
  expirationHours: number,
  maxUses: number
): Promise<VerificationCode> {
  const codes = getStoredData(CODES_STORAGE_KEY);
  
  const code: VerificationCode = {
    id: uuidv4(),
    code: generateSecureCode(),
    type,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + expirationHours * 3600000).toISOString(),
    maxUses,
    currentUses: 0,
    status: 'active'
  };

  codes[code.id] = code;
  saveStoredData(CODES_STORAGE_KEY, codes);
  
  addLog(code.id, 'generated');
  return code;
}

export async function validateCode(code: string): Promise<VerificationCode | null> {
  const codes = getStoredData(CODES_STORAGE_KEY);
  const foundCode = Object.values(codes).find((c: any) => 
    c.code === code && c.status === 'active'
  );

  if (!foundCode) return null;

  // Verificar caducidad
  if (new Date(foundCode.expiresAt) < new Date()) {
    await revokeCode(foundCode.id, 'expired');
    return null;
  }

  // Verificar usos máximos
  if (foundCode.currentUses >= foundCode.maxUses) {
    await revokeCode(foundCode.id, 'used');
    return null;
  }

  return foundCode;
}

export async function useCode(code: string): Promise<VerificationCode | null> {
  const validCode = await validateCode(code);
  if (!validCode) return null;

  const codes = getStoredData(CODES_STORAGE_KEY);
  codes[validCode.id].currentUses += 1;
  
  if (codes[validCode.id].currentUses >= codes[validCode.id].maxUses) {
    codes[validCode.id].status = 'used';
  }
  
  saveStoredData(CODES_STORAGE_KEY, codes);
  addLog(validCode.id, 'used');
  
  return codes[validCode.id];
}

export async function revokeCode(
  id: string,
  reason: 'expired' | 'used' | 'revoked' = 'revoked'
): Promise<void> {
  const codes = getStoredData(CODES_STORAGE_KEY);
  if (codes[id]) {
    codes[id].status = reason;
    saveStoredData(CODES_STORAGE_KEY, codes);
    addLog(id, reason);
  }
}

export async function cleanupCodes(): Promise<void> {
  const codes = getStoredData(CODES_STORAGE_KEY);
  const now = new Date();

  Object.entries(codes).forEach(([id, code]: [string, any]) => {
    if (
      code.status === 'active' && 
      (new Date(code.expiresAt) < now || code.currentUses >= code.maxUses)
    ) {
      codes[id].status = new Date(code.expiresAt) < now ? 'expired' : 'used';
      addLog(id, 'cleaned', `Auto cleanup: ${codes[id].status}`);
    }
  });

  saveStoredData(CODES_STORAGE_KEY, codes);
}

export async function listCodes(filters?: {
  type?: UserRole;
  status?: VerificationCodeStatus;
  fromDate?: string;
  toDate?: string;
}): Promise<VerificationCode[]> {
  const codes = Object.values(getStoredData(CODES_STORAGE_KEY));
  
  return codes.filter((code: any) => {
    if (filters?.type && code.type !== filters.type) return false;
    if (filters?.status && code.status !== filters.status) return false;
    if (filters?.fromDate && new Date(code.createdAt) < new Date(filters.fromDate)) return false;
    if (filters?.toDate && new Date(code.createdAt) > new Date(filters.toDate)) return false;
    return true;
  });
}

export async function getLogs(codeId?: string): Promise<VerificationCodeLog[]> {
  const logs = Object.values(getStoredData(LOGS_STORAGE_KEY));
  return codeId ? logs.filter((log: any) => log.codeId === codeId) : logs;
}