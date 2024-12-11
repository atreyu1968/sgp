import { useAuth } from './useAuth';
import { Permission, rolePermissions } from '../types/auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (action: Permission['action'], resource: Permission['resource']): boolean => {
    if (!user) return false;

    const userPermissions = rolePermissions[user.role];
    return userPermissions.some(
      permission => permission.action === action && permission.resource === resource
    );
  };

  const canView = (resource: Permission['resource']): boolean => {
    return hasPermission('view', resource);
  };

  const canCreate = (resource: Permission['resource']): boolean => {
    return hasPermission('create', resource);
  };

  const canEdit = (resource: Permission['resource']): boolean => {
    return hasPermission('edit', resource);
  };

  const canDelete = (resource: Permission['resource']): boolean => {
    return hasPermission('delete', resource);
  };

  const canApprove = (resource: Permission['resource']): boolean => {
    return hasPermission('approve', resource);
  };

  const canReview = (resource: Permission['resource']): boolean => {
    return hasPermission('review', resource);
  };

  const canExport = (resource: Permission['resource']): boolean => {
    return hasPermission('export', resource);
  };

  return {
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canApprove,
    canReview,
    canExport
  };
};