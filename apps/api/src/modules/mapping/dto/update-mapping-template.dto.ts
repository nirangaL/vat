import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMappingTemplateDto {
  @ApiProperty({ example: 'Updated Mapping Name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    example: {
      'Transaction Date': 'transactionDate',
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  mappings?: Record<string, string>;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
