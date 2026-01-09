import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaxablePeriod } from '@shared/core';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Acme (Pvt) Ltd' })
  @IsString()
  company_name: string;

  @ApiProperty({ example: '123456789V' })
  @IsString()
  @Length(9, 10)
  tin: string;

  @ApiPropertyOptional({ example: 'PV98765' })
  @IsOptional()
  @IsString()
  registration_number?: string;

  @ApiPropertyOptional({ enum: TaxablePeriod, default: TaxablePeriod.QUARTERLY })
  @IsOptional()
  @IsEnum(TaxablePeriod)
  taxable_period?: TaxablePeriod;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Manufacturing' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: '10M-50M' })
  @IsOptional()
  @IsString()
  annual_turnover?: string;
}
