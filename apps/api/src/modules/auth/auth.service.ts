import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { User, UserDocument } from '../../schemas/user.schema';
import { RegisterDto, LoginDto, Verify2FADto, RefreshTokenDto } from './dto';
import { EntityStatus, TwoFactorMethod } from '@shared/constants';
import { generateOTP } from '@shared/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.configService.get<number>('BCRYPT_ROUNDS') || 10,
    );

    const user = await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
      status: EntityStatus.ACTIVE,
    });

    const { password, ...result } = user.toObject();
    return result;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked. Try again later.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      return null;
    }

    await this.resetLoginAttempts(user);
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.is2FAEnabled) {
      const tempToken = this.jwtService.sign(
        { sub: user._id, temp: true },
        { expiresIn: '10m' },
      );

      if (user.twoFactorSecret) {
        return {
          requires2FA: true,
          tempToken,
          method: TwoFactorMethod.TOTP,
        };
      }

      const otp = generateOTP(6);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await this.userModel.findByIdAndUpdate(user._id, {
        emailOTP: otp,
        emailOTPExpiry: otpExpiry,
      });

      return {
        requires2FA: true,
        tempToken,
        method: TwoFactorMethod.EMAIL_OTP,
      };
    }

    return this.generateTokens(user);
  }

  async verify2FA(verify2FADto: Verify2FADto) {
    const decoded = this.jwtService.verify(verify2FADto.tempToken);
    if (!decoded.temp) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userModel.findById(decoded.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (verify2FADto.method === TwoFactorMethod.TOTP) {
      const isValid = authenticator.verify({
        token: verify2FADto.code,
        secret: user.twoFactorSecret,
      });
      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    } else if (verify2FADto.method === TwoFactorMethod.EMAIL_OTP) {
      if (!user.emailOTP || !user.emailOTPExpiry) {
        throw new BadRequestException('OTP not found');
      }
      if (user.emailOTPExpiry < new Date()) {
        throw new BadRequestException('OTP expired');
      }
      if (user.emailOTP !== verify2FADto.code) {
        throw new UnauthorizedException('Invalid OTP');
      }
      await this.userModel.findByIdAndUpdate(user._id, {
        emailOTP: null,
        emailOTPExpiry: null,
      });
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const decoded = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.userModel.findById(decoded.sub);
      if (!user || user.refreshToken !== refreshTokenDto.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken,
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  private async handleFailedLogin(user: UserDocument) {
    const maxAttempts = this.configService.get<number>('MAX_LOGIN_ATTEMPTS') || 5;
    const lockoutDuration =
      this.configService.get<number>('LOCKOUT_DURATION_MINUTES') || 30;

    user.loginAttempts += 1;

    if (user.loginAttempts >= maxAttempts) {
      user.lockedUntil = new Date(Date.now() + lockoutDuration * 60 * 1000);
    }

    await user.save();
  }

  private async resetLoginAttempts(user: UserDocument) {
    if (user.loginAttempts > 0 || user.lockedUntil) {
      user.loginAttempts = 0;
      user.lockedUntil = undefined;
      await user.save();
    }
  }
}
