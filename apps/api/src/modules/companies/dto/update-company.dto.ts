import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { EntityStatus } from '@shared/constants';
import { RegisterCompanyDto } from './register-company.dto';

export class UpdateCompanyDto extends PartialType(RegisterCompanyDto) {
  @ApiProperty({ example: 'VAT123456789', required: false })
  @IsString()
  @IsOptional()
  vatRegistrationNumber?: string;

  @ApiProperty({ enum: EntityStatus, required: false })
  @IsEnum(EntityStatus)
  @IsOptional()
  status?: EntityStatus;
}
