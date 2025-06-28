import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { Account } from '../account.model';


/** Actions */
export class LoadAccounts {
  static readonly type = '[Account] Load Accounts';
}

export class AddAccount {
  static readonly type = '[Account] Add Account';
  constructor(public payload: Omit<Account, 'id'>) {}
}

export class UpdateBalance {
  static readonly type = '[Account] Update Balance';
  constructor(public id: string, public balance: number) {}
}

/** State Model */
export interface AccountStateModel {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

/** Default State */
@State<AccountStateModel>({
  name: 'account',
  defaults: {
    accounts: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class AccountState {
  constructor(private accountService: AccountService) {}

  /** Selector: get all accounts */
  @Selector()
  static accounts(state: AccountStateModel): Account[] {
    return state.accounts;
  }

  /** Selector: loading flag */
  @Selector()
  static isLoading(state: AccountStateModel): boolean {
    return state.loading;
  }

  /** Load accounts from Firebase */
  @Action(LoadAccounts)
  loadAccounts(ctx: StateContext<AccountStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.accountService.getAccounts().pipe(
      tap(accounts => ctx.patchState({ accounts, loading: false })),
      catchError(err => {
        ctx.patchState({ error: err.message, loading: false });
        return throwError(() => err);
      })
    );
  }

  /** Add a new account */
  @Action(AddAccount)
  addAccount(ctx: StateContext<AccountStateModel>, action: AddAccount) {
    ctx.patchState({ loading: true, error: null });
    return this.accountService.createAccount(action.payload).then(() => {
      // after create, reload all accounts
      return ctx.dispatch(new LoadAccounts());
    }).catch(err => {
      ctx.patchState({ error: err.message, loading: false });
      throw err;
    });
  }

  /** Update an account’s balance */
  @Action(UpdateBalance)
  updateBalance(ctx: StateContext<AccountStateModel>, action: UpdateBalance) {
    return this.accountService.updateBalance(action.id, action.balance)
      .then(() => {
        // update local state
        const state = ctx.getState();
        const updated = state.accounts.map(acc =>
          acc.id === action.id ? { ...acc, balance: action.balance } : acc
        );
        ctx.patchState({ accounts: updated });
      })
      .catch(err => {
        ctx.patchState({ error: err.message });
        throw err;
      });
  }
}
