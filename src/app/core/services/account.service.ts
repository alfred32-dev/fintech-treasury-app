// account.service.ts
import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from, throwError, defer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Account } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private basePath = 'accounts';

  constructor(private injector: Injector, private db: AngularFireDatabase) {}

  getAccounts(): Observable<Account[]> {
    return defer(() =>
      runInInjectionContext(this.injector, () =>
        this.db
          .list<Account>(this.basePath)
          .snapshotChanges()
          .pipe(
            map(changes =>
              changes.map(c => ({
                ...(c.payload.val() as Account),
                id: c.payload.key!,
              }))
            )
          )
      )
    ).pipe(
      catchError(err => {
        console.error('Error fetching accounts', err);
        return throwError(() => new Error('Could not load accounts'));
      })
    );
  }

  private getAccountsOnce(): Promise<Account[]> {
    return runInInjectionContext(this.injector, () =>
      this.db
        .list<Account>(this.basePath)
        .query.once('value')
        .then(snapshot => {
          const raw = snapshot.val();
          return raw ? (Object.values(raw) as Account[]) : [];
        })
    ).catch(err => {
      console.error('Error fetching accounts once', err);
      throw new Error('Could not load accounts');
    });
  }

  getAccountsOnce$(): Observable<Account[]> {
    return from(this.getAccountsOnce());
  }

  getAccountById(id: string): Observable<Account | null> {
    return defer(() =>
      runInInjectionContext(this.injector, () =>
        this.db.object<Account>(`${this.basePath}/${id}`).valueChanges()
      )
    ).pipe(
      map(acc => (acc ? { ...acc, id } : null)),
      catchError(err => {
        console.error(`Error fetching account ${id}`, err);
        return throwError(() => new Error('Could not load account'));
      })
    );
  }

  createAccount(account: Omit<Account, 'id'>): Promise<void> {
    const id = this.db.createPushId();
    return runInInjectionContext(this.injector, () =>
      this.db.object(`${this.basePath}/${id}`).set({ ...account, id })
    ).catch(err => {
      console.error('Error creating account', err);
      throw new Error('Could not create account');
    });
  }

  updateBalance(id: string, newBalance: number): Promise<void> {
    return runInInjectionContext(this.injector, () =>
      this.db.object(`${this.basePath}/${id}`).update({ balance: newBalance })
    ).catch(err => {
      console.error(`Error updating balance for ${id}`, err);
      throw new Error('Could not update balance');
    });
  }
}
