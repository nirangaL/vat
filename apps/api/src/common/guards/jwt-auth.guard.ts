import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseService } from '../../supabase/supabase.service';
import { UserRole } from '@shared/constants';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization: string | undefined = request.headers?.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const accessToken = authorization.slice('Bearer '.length);

    const authUser = await this.supabaseService.getAuthUser(accessToken);

    const tenantIdFromMetadata = authUser.app_metadata?.tenant_id;
    const roleFromMetadata = authUser.app_metadata?.role;

    let tenantId: string | undefined =
      typeof tenantIdFromMetadata === 'string' ? tenantIdFromMetadata : undefined;

    let role: UserRole | undefined =
      typeof roleFromMetadata === 'string'
        ? (roleFromMetadata as UserRole)
        : undefined;

    const admin = this.supabaseService.getAdminClient();
    const { data: dbUser, error: dbUserError } = await admin
      .from('users')
      .select('tenant_id, role, full_name, is_team_member')
      .eq('id', authUser.id)
      .maybeSingle();

    if (dbUserError) {
      this.supabaseService.handleError(dbUserError);
    }

    if (dbUser) {
      if (typeof dbUser.tenant_id === 'string') {
        tenantId = dbUser.tenant_id;
      }
      if (typeof dbUser.role === 'string') {
        role = dbUser.role as UserRole;
      }
    }

    if (!tenantId || !UUID_REGEX.test(tenantId)) {
      throw new UnauthorizedException('Invalid tenant context');
    }

    request.accessToken = accessToken;
    request.tenantId = tenantId;
    request.supabase = this.supabaseService.createUserClient(accessToken);

    request.user = {
      userId: authUser.id,
      email: authUser.email,
      fullName: dbUser?.full_name,
      role: role ?? UserRole.CLIENT,
      tenantId,
      isTeamMember: dbUser?.is_team_member,
      accessToken,
    };

    return true;
  }
}
