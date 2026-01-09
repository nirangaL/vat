import type { SupabaseClient } from '@supabase/supabase-js';

declare module 'express-serve-static-core' {
  interface Request {
    tenantId?: string;
    organization_id?: string;
    accessToken?: string;
    jwtPayload?: Record<string, any>;
    supabase?: SupabaseClient;
    user?: any;
  }
}
