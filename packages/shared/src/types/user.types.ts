import { UserRole } from '../constants/enums';

// Base user type without sensitive data
export interface CurrentUser {
  id: string;
  email: string;
  fullName?: string;
  organizationId: string;
  role: UserRole;
  isTeamMember: boolean;
  isActive: boolean;
  twoFaEnabled: boolean;
  lastLogin?: Date;
}

// User DTO for API responses
export interface UserDto extends CurrentUser {
  createdAt: Date;
  updatedAt: Date;
}

// User with sensitive data (for internal operations only)
export interface UserWithPassword extends CurrentUser {
  passwordHash: string;
  refreshTokenHash?: string;
}

// Minimal user info for audit logs and references
export interface UserReference {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
}

// User creation/invitation payload
export interface CreateUserPayload {
  email: string;
  password: string;
  fullName?: string;
  organizationId: string;
  role: UserRole;
}

// Request context interface
export interface RequestContext {
  user?: CurrentUser;
  organizationId?: string;
  ip?: string;
  userAgent?: string;
}
