import { UserRole } from '../constants/enums';
import { CurrentUser } from './user.types';

// Authentication payload (decoded JWT)
export interface AuthPayload {
  sub: string; // user id
  email: string;
  organizationId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Refresh token payload
export interface RefreshPayload {
  sub: string; // user id
  token: string; // refresh token
}

// Login response
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: CurrentUser;
}

// Refresh token response
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
