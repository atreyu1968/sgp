import React from 'react';
import { Permission } from '../types/auth';
import { usePermissions } from '../hooks/usePermissions';

interface ProtectedComponentProps {
  action: Permission['action'];
  resource: Permission['resource'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  action,
  resource,
  children,
  fallback = null
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(action, resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;