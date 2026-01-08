import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMappingTemplateDto } from './create-mapping-template.dto';

export class UpdateMappingTemplateDto extends PartialType(
  OmitType(CreateMappingTemplateDto, ['systemType', 'companyId'] as const),
) {}
