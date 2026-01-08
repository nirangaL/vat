import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsObject, IsOptional, IsBoolean } from 'class-validator';
import { MappingSystemType } from '@shared/constants';

export class CreateMappingTemplateDto {
  @ApiProperty({ example: 'My Custom QuickBooks Mapping' })
  @IsString()
  name: string;

  @ApiProperty({ enum: MappingSystemType, example: MappingSystemType.QUICKBOOKS })
  @IsEnum(MappingSystemType)
  systemType: MappingSystemType;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    example: {
      'Transaction Date': 'transactionDate',
      'Invoice Number': 'invoiceNumber',
    },
  })
  @IsObject()
  mappings: Record<string, string>;

  @ApiProperty({ example: 'Custom mapping for specific Excel format', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
