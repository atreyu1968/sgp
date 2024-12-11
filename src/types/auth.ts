export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  center?: string;
  department?: string;
}

export type UserRole = 'admin' | 'coordinator' | 'presenter' | 'reviewer' | 'guest';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Permission {
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'review' | 'export';
  resource: 'projects' | 'users' | 'convocatorias' | 'reviews' | 'settings' | 'system' | 'reports';
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    // Full access to everything
    { action: 'view', resource: 'projects' },
    { action: 'create', resource: 'projects' },
    { action: 'edit', resource: 'projects' },
    { action: 'delete', resource: 'projects' },
    { action: 'approve', resource: 'projects' },
    { action: 'view', resource: 'users' },
    { action: 'create', resource: 'users' },
    { action: 'edit', resource: 'users' },
    { action: 'delete', resource: 'users' },
    { action: 'view', resource: 'convocatorias' },
    { action: 'create', resource: 'convocatorias' },
    { action: 'edit', resource: 'convocatorias' },
    { action: 'delete', resource: 'convocatorias' },
    { action: 'view', resource: 'reviews' },
    { action: 'create', resource: 'reviews' },
    { action: 'edit', resource: 'reviews' },
    { action: 'delete', resource: 'reviews' },
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' },
    { action: 'view', resource: 'system' },
    { action: 'create', resource: 'system' },
    { action: 'edit', resource: 'system' },
    { action: 'delete', resource: 'system' },
    { action: 'view', resource: 'reports' },
    { action: 'export', resource: 'reports' }
  ],
  coordinator: [
    // Can manage projects, users, and reviews
    { action: 'view', resource: 'projects' },
    { action: 'create', resource: 'projects' },
    { action: 'edit', resource: 'projects' },
    { action: 'approve', resource: 'projects' },
    { action: 'view', resource: 'users' },
    { action: 'create', resource: 'users' },
    { action: 'edit', resource: 'users' },
    { action: 'view', resource: 'convocatorias' },
    { action: 'view', resource: 'reviews' },
    { action: 'create', resource: 'reviews' },
    { action: 'edit', resource: 'reviews' },
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' },
    { action: 'view', resource: 'reports' },
    { action: 'export', resource: 'reports' }
  ],
  presenter: [
    // Can manage their own projects
    { action: 'view', resource: 'projects' },
    { action: 'create', resource: 'projects' },
    { action: 'edit', resource: 'projects' },
    { action: 'view', resource: 'reviews' },
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' }
  ],
  reviewer: [
    // Can view projects and create/edit reviews
    { action: 'view', resource: 'projects' },
    { action: 'view', resource: 'reviews' },
    { action: 'create', resource: 'reviews' },
    { action: 'edit', resource: 'reviews' },
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' }
  ],
  guest: [
    // Can only view public information
    { action: 'view', resource: 'projects' },
    { action: 'view', resource: 'settings' }
  ]
};