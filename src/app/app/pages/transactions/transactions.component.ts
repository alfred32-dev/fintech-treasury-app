
import { Component, OnInit, Signal, computed, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';

import { LoadTransactions } from '../../../core/models/states/transaction.state';
import { LoadAccounts }     from '../../../core/models/states/account.state';
import { Transaction }      from '../../../core/models/transaction.model';
import { Account }          from '../../../core/models/account.model';
import { FutureTransfersComponent } from '../../../components/transfer/future-transfers/future-transfers.component';

interface AppState {
  account: {
    accounts: Account[];
    loading: boolean;
    error: string | null;
  };
  transaction: {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
  };
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FutureTransfersComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  // Signals for raw data
  accounts     !: Signal<Account[]>;
  transactions !: Signal<Transaction[]>;
  loading      !: Signal<boolean>;

  // Computed views
  recentTransactions !: Signal<Transaction[]>;
  accountNameMap     !: Signal<Record<string, string>>;

  private store = inject(Store);

  constructor() {
    // select accounts + transactions
    this.accounts = this.store.selectSignal(s => s.account.accounts || []);
    this.transactions = this.store.selectSignal(s => s.transaction.transactions || []);
    this.loading = this.store.selectSignal(s => s.transaction.loading);

    // recent 20 tx
    this.recentTransactions = computed(() =>
      [...this.transactions()]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20)
    );

    // map ID → name
    this.accountNameMap = computed(() =>
      Object.fromEntries(
        this.accounts().map(acc => [acc.id, acc.name])
      )
    );
  }

  ngOnInit(): void {
    // fire both loads
    this.store.dispatch(new LoadAccounts());
    this.store.dispatch(new LoadTransactions());
  }
}
