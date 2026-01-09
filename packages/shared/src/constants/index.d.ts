export * from './enums';
export declare const VAT_RATES: {
  readonly STANDARD: 18;
  readonly ZERO: 0;
  readonly EXEMPT: 0;
};
export declare const PASSWORD_MIN_LENGTH = 8;
export declare const PASSWORD_REGEX: RegExp;
export declare const TIN_REGEX: RegExp;
export declare const FILE_SIZE_LIMITS: {
  readonly CSV_MAX_SIZE: number;
  readonly XLSX_MAX_SIZE: number;
  readonly DOCUMENT_MAX_SIZE: number;
};
export declare const SUPPORTED_FILE_TYPES: {
  readonly SPREADSHEET: readonly [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  readonly DOCUMENT: readonly ['application/pdf', 'image/jpeg', 'image/png', 'application/zip'];
};
export declare const OTP_EXPIRY_MINUTES = 10;
export declare const OTP_LENGTH = 6;
export declare const JWT_EXPIRY: {
  readonly ACCESS_TOKEN: '15m';
  readonly REFRESH_TOKEN: '7d';
};
