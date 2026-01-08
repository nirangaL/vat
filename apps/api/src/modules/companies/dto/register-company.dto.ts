import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Colombo' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Western Province' })
  @IsString()
  province: string;

  @ApiProperty({ example: '00100' })
  @IsString()
  postalCode: string;
}

export class RegisterCompanyDto {
  @ApiProperty({ example: 'ABC Solutions (Pvt) Ltd' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123456789V' })
  @IsString()
  tin: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ example: 'contact@abcsolutions.lk' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ example: '+94112345678' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  registrationDate: string;

  @ApiProperty({ example: 'Technology Services' })
  @IsString()
  businessType: string;
}
