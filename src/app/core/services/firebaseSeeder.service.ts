import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Account } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class FirebaseSeederService {
  constructor(private db: AngularFireDatabase) {}

  seedData(): void {
    const accounts: Account[] = [
      { id: 'acc-1', name: 'USD Wallet', currency: 'USD', balance: 5000 },
      { id: 'acc-2', name: 'KES Account', currency: 'KES', balance: 200000 },
      { id: 'acc-3', name: 'NGN Reserve', currency: 'NGN', balance: 1000000 },
      { id: 'acc-4', name: 'EUR Holding', currency: 'EUR', balance: 3000 },
    ];

    const now = Date.now(); // single reference timestamp

    const transactions: Transaction[] = [
      {
        id: 'txn-1',
        fromAccountId: 'acc-1',
        toAccountId: 'acc-2',
        amount: 200,
        currency: 'USD',
        status: 'Completed',
        timestamp: now,
        note: 'Initial transfer',
      },
      {
        id: 'txn-2',
        fromAccountId: 'acc-2',
        toAccountId: 'acc-3',
        amount: 10000,
        currency: 'KES',
        status: 'Completed',
        timestamp: now + 1000,
      },
      {
        id: 'txn-3',
        fromAccountId: 'acc-3',
        toAccountId: 'acc-1',
        amount: 150000,
        currency: 'NGN',
        status: 'Failed',
        timestamp: now + 2000,
        note: 'Insufficient balance',
      },
    ];

    const ops = [
      ...accounts.map(acc => this.db.object(`/accounts/${acc.id}`).set(acc)),
      ...transactions.map(txn => this.db.object(`/transactions/${txn.id}`).set(txn)),
    ];

    Promise.all(ops)
      .then(() => console.log('✅ Firebase seed completed'))
      .catch(err => console.error('❌ Seeding failed:', err));
  }
}
