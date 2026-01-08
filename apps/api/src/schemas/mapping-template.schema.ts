import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MappingSystemType } from '@shared/constants';

export type MappingTemplateDocument = MappingTemplate & Document;

@Schema({ timestamps: true, collection: 'mapping_templates' })
export class MappingTemplate {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: Object.values(MappingSystemType) })
  systemType: MappingSystemType;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  companyId?: Types.ObjectId;

  @Prop({ required: true, default: false })
  isDefault: boolean;

  @Prop({ type: Object, required: true })
  mappings: Record<string, string>;

  @Prop()
  description?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const MappingTemplateSchema = SchemaFactory.createForClass(MappingTemplate);

MappingTemplateSchema.index({ systemType: 1, isDefault: 1 });
MappingTemplateSchema.index({ companyId: 1 });
