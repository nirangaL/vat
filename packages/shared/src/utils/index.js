"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.calculateVAT = calculateVAT;
exports.generateOTP = generateOTP;
exports.slugify = slugify;
exports.delay = delay;
function formatCurrency(amount, currency = 'LKR') {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency,
    }).format(amount);
}
function formatDate(date, format = 'short') {
    if (format === 'long') {
        return new Intl.DateTimeFormat('en-LK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    }
    return new Intl.DateTimeFormat('en-LK', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}
function calculateVAT(amount, vatRate) {
    const vat = amount * (vatRate / 100);
    return {
        gross: amount + vat,
        vat,
        net: amount,
    };
}
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=index.js.map