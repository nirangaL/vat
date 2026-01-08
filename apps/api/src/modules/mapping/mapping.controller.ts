import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MappingService } from './mapping.service';
import { CreateMappingTemplateDto, UpdateMappingTemplateDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@ApiTags('Mapping')
@Controller('mapping')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  @Post('seed-defaults')
  @ApiOperation({ summary: 'Seed default mapping templates (run once)' })
  @ApiResponse({ status: 201, description: 'Default templates seeded' })
  async seedDefaults() {
    return this.mappingService.seedDefaultTemplates();
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create custom mapping template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid mappings' })
  async create(@Body() createDto: CreateMappingTemplateDto) {
    return this.mappingService.create(createDto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all mapping templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAll(@Query() query: any) {
    return this.mappingService.findAll(query);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get mapping template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findById(@Param('id') id: string) {
    return this.mappingService.findById(id);
  }

  @Patch('templates/:id')
  @ApiOperation({ summary: 'Update mapping template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMappingTemplateDto,
  ) {
    return this.mappingService.update(id, updateDto);
  }

  @Delete('templates/:id')
  @ApiOperation({ summary: 'Delete mapping template' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete default templates' })
  async delete(@Param('id') id: string) {
    return this.mappingService.delete(id);
  }

  @Post('detect')
  @ApiOperation({ summary: 'Detect system type from CSV/Excel headers' })
  @ApiResponse({ status: 200, description: 'System type detected' })
  async detectSystemType(@Body('headers') headers: string[]) {
    return this.mappingService.detectSystemType(headers);
  }

  @Get('canonical-fields')
  @ApiOperation({ summary: 'Get canonical field definitions' })
  @ApiResponse({ status: 200, description: 'Canonical fields retrieved' })
  async getCanonicalFields() {
    return this.mappingService.getCanonicalFields();
  }
}
