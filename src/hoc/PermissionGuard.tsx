'use client';

import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useAppSelector } from '@/hooks/useStore';
import {selectIsAuthenticated} from "@/features/auth/slice"

interface PermissionGuardProps {
  /** Single permission slug required */
  permission?: string;
  /** User must have AT LEAST ONE of these slugs */
  anyOf?: string[];
  /** User must have ALL of these slugs */
  allOf?: string[];
  /** Required role type(s) e.g. 'admin' or ['admin', 'staff'] */
  roles?: string | string[];
  /** Rendered when access is denied. Default is null. */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}


export function PermissionGuard({
  permission,
  anyOf,
  allOf,
  roles,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { can, canAny, canAll, isRole } = usePermission();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) return <>{fallback}</>;

  let hasAccess = true;

  if (permission) {
    hasAccess = hasAccess && can(permission);
  }

  if (anyOf && anyOf.length > 0) {
    hasAccess = hasAccess && canAny(anyOf);
  }

  if (allOf && allOf.length > 0) {
    hasAccess = hasAccess && canAll(allOf);
  }

  if (roles) {
    hasAccess = hasAccess && isRole(roles);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}