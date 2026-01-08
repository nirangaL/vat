import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MappingController } from './mapping.controller';
import { MappingService } from './mapping.service';
import { MappingTemplate, MappingTemplateSchema } from '../../schemas/mapping-template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MappingTemplate.name, schema: MappingTemplateSchema },
    ]),
  ],
  controllers: [MappingController],
  providers: [MappingService],
  exports: [MappingService],
})
export class MappingModule {}
