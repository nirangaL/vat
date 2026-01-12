import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@shared/core';

import { CurrentTenant, CurrentUser, Public, Roles } from '../../common/decorators';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

import { JwtRefreshGuard, RolesGuard } from './guards';

import { AuthService } from './auth.service';
import { LoginDto, RegisterUserDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(TenantContextInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email/password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@CurrentUser() user: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(user.userId, user.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (revoke refresh token)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@CurrentUser() user: { userId: string }) {
    return this.authService.logout(user.userId);
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
