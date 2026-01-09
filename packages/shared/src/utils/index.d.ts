export declare function formatCurrency(amount: number, currency?: string): string;
export declare function formatDate(date: Date, format?: 'short' | 'long'): string;
export declare function calculateVAT(
  amount: number,
  vatRate: number,
): {
  gross: number;
  vat: number;
  net: number;
};
export declare function generateOTP(length?: number): string;
export declare function slugify(text: string): string;
export declare function delay(ms: number): Promise<void>;
