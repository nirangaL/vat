"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRY = exports.OTP_LENGTH = exports.OTP_EXPIRY_MINUTES = exports.SUPPORTED_FILE_TYPES = exports.FILE_SIZE_LIMITS = exports.TIN_REGEX = exports.PASSWORD_REGEX = exports.PASSWORD_MIN_LENGTH = exports.VAT_RATES = void 0;
__exportStar(require("./enums"), exports);
exports.VAT_RATES = {
    STANDARD: 18,
    ZERO: 0,
    EXEMPT: 0,
};
exports.PASSWORD_MIN_LENGTH = 8;
exports.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
exports.TIN_REGEX = /^\d{9}[A-Z]?$/;
exports.FILE_SIZE_LIMITS = {
    CSV_MAX_SIZE: 10 * 1024 * 1024,
    XLSX_MAX_SIZE: 10 * 1024 * 1024,
    DOCUMENT_MAX_SIZE: 50 * 1024 * 1024,
};
exports.SUPPORTED_FILE_TYPES = {
    SPREADSHEET: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    DOCUMENT: ['application/pdf', 'image/jpeg', 'image/png', 'application/zip'],
};
exports.OTP_EXPIRY_MINUTES = 10;
exports.OTP_LENGTH = 6;
exports.JWT_EXPIRY = {
    ACCESS_TOKEN: '15m',
    REFRESH_TOKEN: '7d',
};
//# sourceMappingURL=index.js.map