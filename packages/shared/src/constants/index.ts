export * from './enums';

export const VAT_RATES = {
  STANDARD: 18,
  ZERO: 0,
  EXEMPT: 0,
} as const;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const TIN_REGEX = /^\d{9}[A-Z]?$/;

export const FILE_SIZE_LIMITS = {
  CSV_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  XLSX_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  DOCUMENT_MAX_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

export const SUPPORTED_FILE_TYPES = {
  SPREADSHEET: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  DOCUMENT: ['application/pdf', 'image/jpeg', 'image/png', 'application/zip'],
} as const;

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_LENGTH = 6;

export const JWT_EXPIRY = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
} as const;
