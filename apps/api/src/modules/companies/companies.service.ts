import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../../schemas/company.schema';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto';
import { validateTIN } from '@shared/validators';
import { EntityStatus } from '@shared/constants';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async register(registerCompanyDto: RegisterCompanyDto) {
    if (!validateTIN(registerCompanyDto.tin)) {
      throw new BadRequestException('Invalid TIN format');
    }

    const existingCompany = await this.companyModel.findOne({
      tin: registerCompanyDto.tin,
    });

    if (existingCompany) {
      throw new ConflictException('Company with this TIN already exists');
    }

    const company = await this.companyModel.create({
      ...registerCompanyDto,
      status: EntityStatus.PENDING,
    });

    return company;
  }

  async findAll(query: any = {}) {
    const { page = 1, limit = 10, status } = query;
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      this.companyModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.companyModel.countDocuments(filter),
    ]);

    return {
      items: companies,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const company = await this.companyModel.findById(id).lean();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async findByTIN(tin: string) {
    const company = await this.companyModel.findOne({ tin }).lean();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyModel
      .findByIdAndUpdate(id, { $set: updateCompanyDto }, { new: true })
      .lean();

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async validateTINWithIRD(tin: string) {
    if (!validateTIN(tin)) {
      return { isValid: false, message: 'Invalid TIN format' };
    }

    return {
      isValid: true,
      message: 'TIN format is valid',
    };
  }
}
