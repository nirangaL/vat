"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTIN = validateTIN;
exports.validatePassword = validatePassword;
exports.validateEmail = validateEmail;
exports.validateVATRate = validateVATRate;
exports.validatePhoneNumber = validatePhoneNumber;
const constants_1 = require("../constants");
function validateTIN(tin) {
    return constants_1.TIN_REGEX.test(tin);
}
function validatePassword(password) {
    const errors = [];
    if (password.length < constants_1.PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${constants_1.PASSWORD_MIN_LENGTH} characters long`);
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[@$!%*?&]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validateVATRate(rate) {
    return rate >= 0 && rate <= 100;
}
function validatePhoneNumber(phone) {
    const phoneRegex = /^(\+94|0)?[0-9]{9}$/;
    return phoneRegex.test(phone);
}
//# sourceMappingURL=index.js.map