import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'ABC VAT Consultants' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'PV12345' })
  @IsOptional()
  @IsString()
  registration_number?: string;

  @ApiProperty({ example: '123456789V', description: 'Sri Lankan TIN' })
  @IsString()
  @Length(9, 10)
  tin: string;

  @ApiProperty({ example: 'support@abcvat.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://abcvat.com' })
  @IsOptional()
  @IsUrl()
  website?: string;
}
