export type UserRole = 'admin' | 'coordinator' | 'presenter' | 'reviewer' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  center?: string;
  department?: string;
  specialty?: string;
  dni?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  presenter: 'Presentador',
  reviewer: 'Revisor',
  guest: 'Invitado'
};