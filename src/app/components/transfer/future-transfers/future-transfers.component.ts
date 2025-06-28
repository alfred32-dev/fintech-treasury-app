// src/app/features/future-transfers/future-transfers.component.ts
import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, tap, finalize, switchMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

import { SchedulerService } from '../../../core/services/scheduler.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { ToastService } from '../../../core/services/toast.service';
import { AccountService } from '../../../core/services/account.service';

import { Transaction, StatusCode } from '../../../core/models/transaction.model';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-future-transfers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './future-transfers.component.html',
  styleUrls: ['./future-transfers.component.css']
})
export class FutureTransfersComponent implements OnInit {
  loading = signal(true);
  scheduled = signal<Transaction[]>([]);
  accounts = signal<Account[]>([]);
  selected = signal<Transaction | null>(null);

  private _txLoaded = false;
  private _acctsLoaded = false;

  accountMap = computed(() =>
    this.accounts().reduce((acc, a) => {
      acc[a.id] = a.name;
      return acc;
    }, {} as Record<string, string>)
  );

  constructor(
    private scheduler: SchedulerService,
    private txService: TransactionService,
    private toast: ToastService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.scheduler.getScheduledTransfers$()
      .pipe(
        catchError(err => {
          console.error(err);
          this.toast.error('Could not load scheduled transfers.');
          return of([] as Transaction[]);
        })
      )
      .subscribe(txs => {
        this.scheduled.set(txs);
        this._txLoaded = true;
        this._checkLoadingComplete();
      });

    this.accountService.getAccounts()
      .pipe(
        catchError(err => {
          console.error(err);
          this.toast.error('Could not load accounts.');
          return of([] as Account[]);
        })
      )
      .subscribe(accts => {
        this.accounts.set(accts);
        this._acctsLoaded = true;
        this._checkLoadingComplete();
      });
  }

  private _checkLoadingComplete() {
    if (this._txLoaded && this._acctsLoaded) {
      this.loading.set(false);
    }
  }

  cancel(id: string) {
    this.scheduler.cancelScheduled$(id)
      .pipe(
        catchError(err => {
          console.error(err);
          this.toast.error('Cancellation failed.');
          return of(null);
        })
      )
      .subscribe(() => {
        this.scheduled.update(arr => arr.filter(tx => tx.id !== id));
        this.toast.info('Scheduled transfer canceled.');
      });
  }

  execute(tx: Transaction) {
    // 1) build the completed‐transaction payload
    const completed: Omit<Transaction, 'id'> = {
      ...tx,
      status: StatusCode.Completed,
      timestamp: Date.now()
    };

    // 2) write new transaction, then remove scheduled entry
    this.txService.createTransaction(completed).pipe(
      switchMap(() =>
        this.scheduler.cancelScheduled$(tx.id)
      ),
      tap(() => {
        // 3) update local list & toast
        this.scheduled.update(arr => arr.filter(t => t.id !== tx.id));
        this.toast.success('Transfer executed successfully.');
      }),
      catchError(err => {
        console.error(err);
        this.toast.error('Execution failed.');
        return of(null);
      })
    )
    .subscribe();
  }

  view(tx: Transaction) {
    this.selected.set(tx);
  }

  closeView() {
    this.selected.set(null);
  }

  isOverdue(tx: Transaction): boolean {
    return tx.timestamp < Date.now();
  }
}
