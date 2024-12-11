import { UserRole } from './user';

export type VerificationCodeStatus = 'active' | 'used' | 'expired' | 'revoked';

export interface VerificationCode {
  id: string;
  code: string;
  type: UserRole;
  createdAt: string;
  expiresAt: string;
  maxUses: number;
  currentUses: number;
  status: VerificationCodeStatus;
}

export interface VerificationCodeConfig {
  enabled: boolean;
  autoCleanup: boolean;
  cleanupInterval: number; // en horas
  defaultExpirationTime: number; // en horas
  defaultMaxUses: number;
}

export interface VerificationCodeLog {
  id: string;
  codeId: string;
  action: 'generated' | 'used' | 'expired' | 'revoked' | 'cleaned';
  timestamp: string;
  details?: string;
}