export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VAT_TEAM_LEAD = 'VAT_TEAM_LEAD',
  VAT_TEAM_MEMBER = 'VAT_TEAM_MEMBER',
  CLIENT = 'CLIENT',
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  FILED = 'FILED',
  CLOSED = 'CLOSED',
}

export enum SubmissionStage {
  DATA_COLLECTION = 1,
  DOCUMENT_PREPARATION = 2,
  REVIEW = 3,
  IRD_SUBMISSION = 4,
  PAYMENT = 5,
  ACKNOWLEDGMENT = 6,
  FILING = 7,
  CLOSED = 8,
}

export enum TaxablePeriod {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum VATScheduleType {
  SCHEDULE_01 = 'SCHEDULE_01',
  SCHEDULE_02 = 'SCHEDULE_02',
  SCHEDULE_03 = 'SCHEDULE_03',
  SCHEDULE_04 = 'SCHEDULE_04',
  SCHEDULE_05 = 'SCHEDULE_05',
  SCHEDULE_06 = 'SCHEDULE_06',
  SCHEDULE_07 = 'SCHEDULE_07',
  SCHEDULE_01_AMENDMENT = 'SCHEDULE_01_AMENDMENT',
  SCHEDULE_02_AMENDMENT = 'SCHEDULE_02_AMENDMENT',
  SCHEDULE_03_AMENDMENT = 'SCHEDULE_03_AMENDMENT',
  SCHEDULE_04_AMENDMENT = 'SCHEDULE_04_AMENDMENT',
  SCHEDULE_05_AMENDMENT = 'SCHEDULE_05_AMENDMENT',
  SCHEDULE_06_AMENDMENT = 'SCHEDULE_06_AMENDMENT',
  SCHEDULE_07_AMENDMENT = 'SCHEDULE_07_AMENDMENT',
}

export enum TransactionType {
  LOCAL_SUPPLY = 'LOCAL_SUPPLY',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  LOCAL_PURCHASE = 'LOCAL_PURCHASE',
  ZERO_RATED = 'ZERO_RATED',
  EXEMPT = 'EXEMPT',
}

export enum NotificationType {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
}

export enum FileUploadStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum MappingSystemType {
  QUICKBOOKS = 'QUICKBOOKS',
  XERO = 'XERO',
  TALLY = 'TALLY',
  CLEARTAX = 'CLEARTAX',
  ZOHO = 'ZOHO',
  CUSTOM = 'CUSTOM',
}

export enum TwoFactorMethod {
  EMAIL_OTP = 'EMAIL_OTP',
  TOTP = 'TOTP',
}

export enum SubscriptionPlan {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
