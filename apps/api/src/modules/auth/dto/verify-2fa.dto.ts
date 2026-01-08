import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { TwoFactorMethod } from '@shared/constants';

export class Verify2FADto {
  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;

  @ApiProperty({ enum: TwoFactorMethod, example: TwoFactorMethod.EMAIL_OTP })
  @IsEnum(TwoFactorMethod)
  method: TwoFactorMethod;

  @ApiProperty({ example: 'temp-token-from-login' })
  @IsString()
  tempToken: string;
}
