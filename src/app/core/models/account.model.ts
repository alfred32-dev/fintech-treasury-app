export type CurrencyCode = 'KES' | 'USD' | 'NGN' | 'EUR' | 'GBP' | 'INR';

export interface Account {
  id: string;
  name: string;
  currency: CurrencyCode;
  balance: number;
}
