import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@shared/constants';
import { CurrentTenant, CurrentUser, Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { AuthService } from './auth.service';
import { LoginDto, RegisterUserDto } from './dto';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(TenantContextInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email/password (Supabase Auth)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.VAT_TEAM_LEAD)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user within the current organization' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async registerUser(@CurrentTenant() organizationId: string, @Body() dto: RegisterUserDto) {
    return this.authService.registerUser(organizationId, dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user retrieved' })
  async me(@CurrentUser() user: any) {
    return user;
  }
}
