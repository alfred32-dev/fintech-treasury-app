// src/app/core/services/scheduler.service.ts
import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, EMPTY, defer } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { Transaction, StatusCode } from '../models/transaction.model';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class SchedulerService {
  private basePath = '/scheduledTransactions';
  private txPath   = '/transactions';

  constructor(
    private injector: Injector,
    private db: AngularFireDatabase,
    private acctService: AccountService
  ) {}

  scheduleFutureTransfer(txn: Transaction): Observable<void> {
    return new Observable<void>(observer => {
      runInInjectionContext(this.injector, () =>
        this.db.object(`${this.basePath}/${txn.id}`).set(txn)
      )
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  getScheduledTransfers$(): Observable<Transaction[]> {
    return defer(() =>
      runInInjectionContext(this.injector, () =>
        this.db
          .list<Transaction>(this.basePath)
          .snapshotChanges()
          .pipe(
            map(changes =>
              changes.map(c => ({
                ...(c.payload.val() as Transaction),
                id: c.payload.key!,
              }))
            )
          )
      )
    );
  }

  cancelScheduled$(id: string): Observable<void> {
    return new Observable<void>(observer => {
      runInInjectionContext(this.injector, () =>
        this.db.object(`${this.basePath}/${id}`).remove()
      )
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  executeNow$(txn: Transaction): Observable<void> {
    return this.acctService.getAccountById(txn.fromAccountId).pipe(
      take(1),
      switchMap(fromAcc =>
        this.acctService.getAccountById(txn.toAccountId).pipe(
          take(1),
          switchMap(toAcc => {
            if (!fromAcc || !toAcc || fromAcc.balance < txn.amount) {
              throw new Error('Insufficient balance or account not found.');
            }

            const newFrom = fromAcc.balance - txn.amount;
            const received = parseFloat(
              (txn.amount * (txn.fxRate ?? 1)).toFixed(2)
            );
            const newTo = toAcc.balance + received;

            const newTxId = this.db.createPushId();
            const completedTxn: Transaction = {
              ...txn,
              id: newTxId,
              status: StatusCode.Completed,
              timestamp: Date.now()
            };

            return new Observable<void>(observer => {
              Promise.all([
                // 1) update source balance
                this.acctService.updateBalance(fromAcc.id, newFrom),
                // 2) update destination balance
                this.acctService.updateBalance(toAcc.id, newTo),
                // 3) write the completed transaction record
                runInInjectionContext(this.injector, () =>
                  this.db.object(`${this.txPath}/${newTxId}`).set(completedTxn)
                ),
                // 4) remove the scheduled‐transaction entry
                runInInjectionContext(this.injector, () =>
                  this.db.object(`${this.basePath}/${txn.id}`).remove()
                )
              ])
                .then(() => {
                  observer.next();
                  observer.complete();
                })
                .catch(err => {
                  observer.error(err);
                });
            });
          })
        )
      ),
      catchError(err => {
        console.error('Execution failed:', err);
        return EMPTY;
      })
    );
  }
}
