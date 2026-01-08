import {
  Controller,
  Get,
  Post,
  Patch,
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
import { CompaniesService } from './companies.service';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '@shared/constants';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new company' })
  @ApiResponse({ status: 201, description: 'Company registered successfully' })
  @ApiResponse({ status: 409, description: 'Company already exists' })
  @ApiResponse({ status: 400, description: 'Invalid TIN format' })
  async register(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.companiesService.register(registerCompanyDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.VAT_TEAM_LEAD)
  @ApiOperation({ summary: 'Get all companies (paginated)' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  async findAll(@Query() query: any) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Get('tin/:tin')
  @ApiOperation({ summary: 'Get company by TIN' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findByTIN(@Param('tin') tin: string) {
    return this.companiesService.findByTIN(tin);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company profile' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Post('validate-tin')
  @ApiOperation({ summary: 'Validate TIN format (future: check with IRD)' })
  @ApiResponse({ status: 200, description: 'TIN validation result' })
  async validateTIN(@Body('tin') tin: string) {
    return this.companiesService.validateTINWithIRD(tin);
  }
}
