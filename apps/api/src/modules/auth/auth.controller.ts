import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@shared/constants';
import { CurrentTenant, CurrentUser, Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { AuthService } from './auth.service';
import { LoginDto, RegisterUserDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
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
  @ApiOperation({ summary: 'Create a new user within the current tenant' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async registerUser(
    @CurrentTenant() tenantId: string,
    @Body() dto: RegisterUserDto,
  ) {
    return this.authService.registerUser(tenantId, dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user retrieved' })
  async me(@CurrentUser() user: any) {
    return user;
  }
}
