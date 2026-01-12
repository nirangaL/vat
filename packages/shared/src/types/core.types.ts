import {
  UserRole,
  EntityStatus,
  SubmissionStage,
  TransactionType,
  VATScheduleType,
} from '../constants/enums';

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: EntityStatus;
  companyId?: string;
  is2FAEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompany {
  id: string;
  name: string;
  tin: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  contactEmail: string;
  contactPhone: string;
  status: EntityStatus;
  registrationDate: Date;
  vatRegistrationNumber?: string;
  businessType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVATTransaction {
  id: string;
  companyId: string;
  transactionDate: Date;
  transactionType: TransactionType;
  invoiceNumber: string;
  supplierTIN?: string;
  supplierName?: string;
  description: string;
  grossAmount: number;
  vatAmount: number;
  netAmount: number;
  vatRate: number;
  scheduleType: VATScheduleType;
  uploadId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFileUpload {
  id: string;
  companyId: string;
  uploadedBy: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  mimeType: string;
  status: string;
  rowCount?: number;
  validRowCount?: number;
  errorRowCount?: number;
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  mappingTemplateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVATSubmission {
  id: string;
  companyId: string;
  vatPeriod: {
    year: number;
    quarter: number;
  };
  stage: SubmissionStage;
  totalOutputVAT: number;
  totalInputVAT: number;
  netVATPayable: number;
  schedules: Array<{
    type: VATScheduleType;
    generated: boolean;
    filePath?: string;
  }>;
  submittedAt?: Date;
  acknowledgmentNumber?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMappingTemplate {
  id: string;
  name: string;
  systemType: string;
  companyId?: string;
  isDefault: boolean;
  mappings: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface INotification {
  id: string;
  userId: string;
  companyId?: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}
