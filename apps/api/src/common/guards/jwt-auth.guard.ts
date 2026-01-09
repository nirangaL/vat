import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@shared/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
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

    const organizationIdFromMetadata = 
      authUser.app_metadata?.organization_id || authUser.app_metadata?.tenant_id;
    const roleFromMetadata = authUser.app_metadata?.role;

    let organizationId: string | undefined =
      typeof organizationIdFromMetadata === 'string' ? organizationIdFromMetadata : undefined;

    let role: UserRole | undefined =
      typeof roleFromMetadata === 'string'
        ? (roleFromMetadata as UserRole)
        : undefined;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: authUser.id },
      select: { organization_id: true, role: true, full_name: true, is_team_member: true }
    });

    if (dbUser) {
      organizationId = dbUser.organization_id;
      role = dbUser.role as UserRole;
    }

    if (!organizationId) {
      throw new UnauthorizedException('Invalid organization context');
    }

    request.accessToken = accessToken;
    request.organization_id = organizationId;
    
    request.user = {
      userId: authUser.id,
      email: authUser.email,
      fullName: dbUser?.full_name,
      role: role ?? UserRole.CLIENT,
      organization_id: organizationId,
      isTeamMember: dbUser?.is_team_member,
      accessToken,
    };

    return true;
  }
}
