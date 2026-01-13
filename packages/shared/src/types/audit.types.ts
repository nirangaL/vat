import { UserRole } from '../constants/enums';

// Audit action base interface
export interface AuditAction {
  action: 'create' | 'update' | 'delete' | 'read';
  entityType: string;
  entityId: string;
  userId: string;
  changes?: Record<string, { before: any; after: any }>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  organizationId?: string;
}

// Audit user action interface
export interface UserAuditAction {
  action:
    | 'login'
    | 'logout'
    | 'create_user'
    | 'update_user'
    | 'delete_user'
    | 'update_role'
    | 'password_change';
  userId: string;
  targetUserId?: string;
  targetRole?: UserRole;
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  organizationId?: string;
}

// Audit response interface
export interface AuditResponse {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    role: string;
  };
  changes?: Record<string, { before: any; after: any }>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}
