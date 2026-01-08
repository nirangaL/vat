import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityStatus } from '@shared/constants';

class AddressDto {
  @ApiProperty({ example: '123 Main Street', required: false })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ example: 'Colombo', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Western Province', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ example: '00100', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;
}

export class UpdateCompanyDto {
  @ApiProperty({ example: 'ABC Solutions (Pvt) Ltd', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: AddressDto, required: false })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ApiProperty({ example: 'contact@abcsolutions.lk', required: false })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty({ example: '+94112345678', required: false })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({ example: 'Technology Services', required: false })
  @IsString()
  @IsOptional()
  businessType?: string;

  @ApiProperty({ example: 'VAT123456789', required: false })
  @IsString()
  @IsOptional()
  vatRegistrationNumber?: string;

  @ApiProperty({ enum: EntityStatus, required: false })
  @IsEnum(EntityStatus)
  @IsOptional()
  status?: EntityStatus;
}
