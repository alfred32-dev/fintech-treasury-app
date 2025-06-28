// src/app/core/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, defer, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private basePath = 'transactions';

  constructor(private db: AngularFireDatabase) {}

  /** Fetch all transactions as an Observable */
  getTransactions(): Observable<Transaction[]> {
    return defer(() =>
      this.db
        .list<Transaction>(this.basePath, ref => ref.orderByChild('timestamp'))
        .snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({
              ...(c.payload.val() as Transaction),
              id: c.payload.key!,
            }))
          )
        )
    ).pipe(
      catchError(err => {
        console.error('Error fetching transactions', err);
        return throwError(() => new Error('Could not load transactions'));
      })
    );
  }

  /**
   * Create a new transaction.
   * Uses the Firebase SDK push() to generate a key without calling inject().
   */
  createTransaction(tx: Omit<Transaction, 'id'>): Observable<void> {
    // 1) Get a new push reference under /transactions
    const pushRef = this.db.database.ref(this.basePath).push();

    // 2) Grab its auto-generated key
    const id = pushRef.key!;
    
    // 3) Write your transaction (including the id) to that ref
    const writePromise: Promise<void> = pushRef.set({ ...tx, id });

    // 4) Wrap the promise in an Observable
    return from(writePromise).pipe(
      catchError(error => {
        console.error('Error creating transaction', error);
        return throwError(() => new Error('Could not create transaction'));
      })
    );
  }

  /** Get all transactions involving a given account */
  getByAccount(accountId: string): Observable<Transaction[]> {
    return this.getTransactions().pipe(
      map(list =>
        list.filter(
          tx => tx.fromAccountId === accountId || tx.toAccountId === accountId
        )
      )
    );
  }

  /** Get all transactions in a given currency */
  getByCurrency(currency: string): Observable<Transaction[]> {
    return this.getTransactions().pipe(
      map(list => list.filter(tx => tx.currency === currency))
    );
  }
}
