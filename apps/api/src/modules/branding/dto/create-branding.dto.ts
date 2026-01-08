import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateBrandingDto {
  @ApiPropertyOptional({ example: 'ABC VAT Consultants' })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiPropertyOptional({ example: 'https://abcvat.com' })
  @IsOptional()
  @IsString()
  company_website?: string;

  @ApiPropertyOptional({ example: 'support@abcvat.com' })
  @IsOptional()
  @IsString()
  support_email?: string;

  @ApiPropertyOptional({ example: '+94 77 123 4567' })
  @IsOptional()
  @IsString()
  support_phone?: string;

  @ApiPropertyOptional({
    example: {
      primary: '#0066CC',
      secondary: '#00CC66',
      accent: '#FF6600',
      background: '#FFFFFF',
      text_color: '#333333',
    },
  })
  @IsOptional()
  @IsObject()
  colors?: Record<string, string>;

  @ApiPropertyOptional({ example: 'Powered by Simplebooks VAT' })
  @IsOptional()
  @IsString()
  footer_text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  custom_assets?: Record<string, any>;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
