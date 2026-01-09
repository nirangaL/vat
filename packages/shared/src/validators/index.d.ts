export declare function validateTIN(tin: string): boolean;
export declare function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
};
export declare function validateEmail(email: string): boolean;
export declare function validateVATRate(rate: number): boolean;
export declare function validatePhoneNumber(phone: string): boolean;
