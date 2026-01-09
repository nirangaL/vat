import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a client', async () => {
    const createClientDto = {
      company_name: 'Test Company',
      tin: '1234567890',
      taxable_period: 'quarterly',
    } as any;

    const expectedResult = {
      id: '1',
      organization_id: 'org-123',
      ...createClientDto,
    };

    jest.spyOn(prisma.client, 'create').mockResolvedValue(expectedResult);

    const result = await service.create('org-123', createClientDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.client.create).toHaveBeenCalledWith({
      data: {
        organization_id: 'org-123',
        ...createClientDto,
      },
    });
  });
});
