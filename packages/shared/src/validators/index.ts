import { TIN_REGEX, PASSWORD_REGEX, PASSWORD_MIN_LENGTH } from '../constants';

export function validateTIN(tin: string): boolean {
  return TIN_REGEX.test(tin);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
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

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateVATRate(rate: number): boolean {
  return rate >= 0 && rate <= 100;
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+94|0)?[0-9]{9}$/;
  return phoneRegex.test(phone);
}
