import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../transaction.model';

/** Actions */
export class LoadTransactions {
  static readonly type = '[Transaction] Load All';
}

export class AddTransaction {
  static readonly type = '[Transaction] Add';
  constructor(public payload: Omit<Transaction, 'id'>) {}
}

export class ClearTransactions {
  static readonly type = '[Transaction] Clear';
}

/** State Model */
export interface TransactionStateModel {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

/** Default State */
@State<TransactionStateModel>({
  name: 'transaction',
  defaults: {
    transactions: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class TransactionState {
  constructor(private txService: TransactionService) {}

  /** Selector: all transactions */
  @Selector()
  static transactions(state: TransactionStateModel): Transaction[] {
    return state.transactions;
  }

  /** Selector: loading flag */
  @Selector()
  static isLoading(state: TransactionStateModel): boolean {
    return state.loading;
  }

  /** Load all transactions from Firebase */
  @Action(LoadTransactions)
  loadTransactions(ctx: StateContext<TransactionStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.txService.getTransactions().pipe(
      tap(transactions => {
        ctx.patchState({ transactions, loading: false });
      }),
      catchError(err => {
        ctx.patchState({ error: err.message || 'Load failed', loading: false });
        return throwError(() => err);
      })
    );
  }

  /** Add a new transaction using Observable-based service */
  @Action(AddTransaction)
  addTransaction(ctx: StateContext<TransactionStateModel>, action: AddTransaction) {
    ctx.patchState({ loading: true, error: null });
    return this.txService.createTransaction(action.payload).pipe(
      switchMap(() => ctx.dispatch(new LoadTransactions())),
      catchError((err: any) => {
        ctx.patchState({ error: err.message || 'Add failed', loading: false });
        return throwError(() => err);
      })
    );
  }

  /** Clear the transaction list (e.g. on logout) */
  @Action(ClearTransactions)
  clear(ctx: StateContext<TransactionStateModel>) {
    ctx.patchState({ transactions: [] });
  }
}
