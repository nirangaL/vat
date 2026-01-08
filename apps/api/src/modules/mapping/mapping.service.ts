import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MappingTemplate, MappingTemplateDocument } from '../../schemas/mapping-template.schema';
import { CreateMappingTemplateDto, UpdateMappingTemplateDto } from './dto';
import { DEFAULT_MAPPING_TEMPLATES, REQUIRED_FIELDS, CANONICAL_FIELDS } from './mapping.constants';
import { MappingSystemType } from '@shared/constants';

@Injectable()
export class MappingService {
  constructor(
    @InjectModel(MappingTemplate.name)
    private mappingTemplateModel: Model<MappingTemplateDocument>,
  ) {}

  async seedDefaultTemplates() {
    const existingTemplates = await this.mappingTemplateModel.countDocuments({
      isDefault: true,
    });

    if (existingTemplates > 0) {
      return { message: 'Default templates already exist' };
    }

    const templates = Object.values(DEFAULT_MAPPING_TEMPLATES);
    await this.mappingTemplateModel.insertMany(
      templates.map((t) => ({ ...t, isDefault: true })),
    );

    return { message: 'Default templates seeded successfully', count: templates.length };
  }

  async create(createDto: CreateMappingTemplateDto) {
    this.validateMappings(createDto.mappings);

    const template = await this.mappingTemplateModel.create(createDto);
    return template;
  }

  async findAll(query: any = {}) {
    const { systemType, companyId, isDefault } = query;
    const filter: any = {};

    if (systemType) {
      filter.systemType = systemType;
    }

    if (companyId) {
      filter.$or = [{ companyId }, { isDefault: true }];
    } else if (isDefault !== undefined) {
      filter.isDefault = isDefault === 'true';
    }

    return this.mappingTemplateModel.find(filter).sort({ isDefault: -1, createdAt: -1 }).lean();
  }

  async findById(id: string) {
    const template = await this.mappingTemplateModel.findById(id).lean();
    if (!template) {
      throw new NotFoundException('Mapping template not found');
    }
    return template;
  }

  async findBySystemType(systemType: MappingSystemType) {
    return this.mappingTemplateModel
      .find({ systemType, isDefault: true })
      .sort({ createdAt: -1 })
      .lean();
  }

  async update(id: string, updateDto: UpdateMappingTemplateDto) {
    if (updateDto.mappings) {
      this.validateMappings(updateDto.mappings);
    }

    const template = await this.mappingTemplateModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .lean();

    if (!template) {
      throw new NotFoundException('Mapping template not found');
    }

    return template;
  }

  async delete(id: string) {
    const template = await this.mappingTemplateModel.findById(id);
    if (!template) {
      throw new NotFoundException('Mapping template not found');
    }

    if (template.isDefault) {
      throw new BadRequestException('Cannot delete default templates');
    }

    await this.mappingTemplateModel.findByIdAndDelete(id);
    return { message: 'Template deleted successfully' };
  }

  async detectSystemType(headers: string[]): Promise<{
    systemType: MappingSystemType;
    confidence: number;
    suggestedTemplate?: any;
  }> {
    const templates = Object.entries(DEFAULT_MAPPING_TEMPLATES);
    let bestMatch: { systemType: MappingSystemType; confidence: number; template: any } = { 
      systemType: MappingSystemType.CUSTOM, 
      confidence: 0, 
      template: null 
    };

    for (const [systemType, template] of templates) {
      const templateHeaders = Object.keys(template.mappings);
      const matchCount = headers.filter((h) => templateHeaders.includes(h)).length;
      const confidence = (matchCount / templateHeaders.length) * 100;

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          systemType: systemType as MappingSystemType,
          confidence,
          template: template,
        };
      }
    }

    return {
      systemType: bestMatch.systemType,
      confidence: bestMatch.confidence,
      suggestedTemplate: bestMatch.template,
    };
  }

  async mapRow(row: Record<string, any>, mappings: Record<string, string>): Promise<any> {
    const mapped: any = {};

    for (const [sourceField, targetField] of Object.entries(mappings)) {
      if (row[sourceField] !== undefined) {
        mapped[targetField] = row[sourceField];
      }
    }

    const missing = REQUIRED_FIELDS.filter((field) => !mapped[field]);
    if (missing.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missing.join(', ')}`);
    }

    return mapped;
  }

  getCanonicalFields() {
    return CANONICAL_FIELDS;
  }

  private validateMappings(mappings: Record<string, string>) {
    const targetFields = Object.values(mappings);
    const missingRequired = REQUIRED_FIELDS.filter((field) => !targetFields.includes(field));

    if (missingRequired.length > 0) {
      throw new BadRequestException(
        `Mapping must include all required fields: ${missingRequired.join(', ')}`,
      );
    }

    const invalidFields = targetFields.filter(
      (field) => !Object.keys(CANONICAL_FIELDS).includes(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid target fields: ${invalidFields.join(', ')}. Must map to canonical fields.`,
      );
    }
  }
}
