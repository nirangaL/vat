import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FileUploadStatus } from '@shared/constants';

export type UploadDocument = Upload & Document;

class UploadError {
  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  field: string;

  @Prop({ required: true })
  message: string;
}

@Schema({ timestamps: true, collection: 'uploads' })
export class Upload {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  filePath: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true, enum: Object.values(FileUploadStatus), default: FileUploadStatus.PENDING })
  status: FileUploadStatus;

  @Prop()
  rowCount?: number;

  @Prop()
  validRowCount?: number;

  @Prop()
  errorRowCount?: number;

  @Prop({ type: [UploadError] })
  errors?: UploadError[];

  @Prop({ type: Types.ObjectId, ref: 'MappingTemplate' })
  mappingTemplateId?: Types.ObjectId;

  @Prop()
  processedAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);

UploadSchema.index({ companyId: 1, createdAt: -1 });
UploadSchema.index({ uploadedBy: 1 });
UploadSchema.index({ status: 1 });
