import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompaniesService } from './companies.service';
import { Company } from '../../schemas/company.schema';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyModel: any;

  const mockCompany = {
    _id: 'company123',
    name: 'Test Company',
    tin: '123456789V',
    address: {
      street: '123 Main St',
      city: 'Colombo',
      province: 'Western',
      postalCode: '00100',
    },
    contactEmail: 'contact@test.com',
    contactPhone: '+94112345678',
    status: 'ACTIVE',
    registrationDate: new Date(),
    businessType: 'Technology',
  };

  const mockCompanyModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companyModel = module.get(getModelToken(Company.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new company', async () => {
      const registerDto = {
        name: 'New Company',
        tin: '987654321V',
        address: mockCompany.address,
        contactEmail: 'new@company.com',
        contactPhone: '+94112345679',
        registrationDate: '2024-01-01',
        businessType: 'Retail',
      };

      mockCompanyModel.findOne.mockResolvedValue(null);
      mockCompanyModel.create.mockResolvedValue({ ...mockCompany, ...registerDto });

      const result = await service.register(registerDto);

      expect(result).toBeDefined();
      expect(mockCompanyModel.findOne).toHaveBeenCalledWith({ tin: registerDto.tin });
    });

    it('should throw BadRequestException for invalid TIN', async () => {
      const registerDto = {
        name: 'New Company',
        tin: 'INVALID',
        address: mockCompany.address,
        contactEmail: 'new@company.com',
        contactPhone: '+94112345679',
        registrationDate: '2024-01-01',
        businessType: 'Retail',
      };

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if company with TIN exists', async () => {
      const registerDto = {
        name: 'New Company',
        tin: '123456789V',
        address: mockCompany.address,
        contactEmail: 'new@company.com',
        contactPhone: '+94112345679',
        registrationDate: '2024-01-01',
        businessType: 'Retail',
      };

      mockCompanyModel.findOne.mockResolvedValue(mockCompany);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return a company by ID', async () => {
      mockCompanyModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCompany),
      });

      const result = await service.findById('company123');

      expect(result).toBeDefined();
      expect(result._id).toBe(mockCompany._id);
    });

    it('should throw NotFoundException if company not found', async () => {
      mockCompanyModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateTINWithIRD', () => {
    it('should return valid for correct TIN format', async () => {
      const result = await service.validateTINWithIRD('123456789V');

      expect(result.isValid).toBe(true);
    });

    it('should return invalid for incorrect TIN format', async () => {
      const result = await service.validateTINWithIRD('INVALID');

      expect(result.isValid).toBe(false);
    });
  });
});
