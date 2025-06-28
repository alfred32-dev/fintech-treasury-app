// transaction.model.ts
import { CurrencyCode } from './account.model';

export enum StatusCode {
  Completed = 'Completed',
  Failed    = 'Failed',
  Scheduled = 'Scheduled'
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: CurrencyCode;
  fxRate?: number;
  status: StatusCode;
  timestamp: number;    // Unix epoch ms
  note?: string;
}
