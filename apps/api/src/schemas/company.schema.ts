import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EntityStatus } from '@shared/constants';

export type CompanyDocument = Company & Document;

class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  postalCode: string;
}

@Schema({ timestamps: true, collection: 'companies' })
export class Company {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  tin: string;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ required: true, lowercase: true, trim: true })
  contactEmail: string;

  @Prop({ required: true, trim: true })
  contactPhone: string;

  @Prop({ required: true, enum: Object.values(EntityStatus), default: EntityStatus.PENDING })
  status: EntityStatus;

  @Prop({ required: true })
  registrationDate: Date;

  @Prop({ trim: true })
  vatRegistrationNumber?: string;

  @Prop({ required: true, trim: true })
  businessType: string;

  @Prop()
  documentIds?: string[];

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.index({ tin: 1 }, { unique: true });
CompanySchema.index({ status: 1 });
CompanySchema.index({ name: 'text' });
