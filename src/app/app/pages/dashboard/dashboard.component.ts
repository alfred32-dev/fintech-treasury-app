
import { Component, OnInit, Signal, computed, effect, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';

import { Account } from '../../../core/models/account.model';
import { Transaction } from '../../../core/models/transaction.model';
import { LoadAccounts } from '../../../core/models/states/account.state';
import { LoadTransactions } from '../../../core/models/states/transaction.state';

import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../components/shared/layout/footer/footer.component';
import { AccountsListComponent } from '../../../components/accounts/accounts-list/accounts-list.component';

interface EnrichedTx extends Transaction {
  fromName: string;
  toName: string;
}

interface AppState {
  account: { accounts: Account[]; loading: boolean; error: string | null };
  transaction: { transactions: Transaction[]; loading: boolean; error: string | null };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, AccountsListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  accounts!: Signal<Account[]>;
  accLoading!: Signal<boolean>;
  transactions!: Signal<Transaction[]>;
  txLoading!: Signal<boolean>;

  accountCount!: Signal<number>;
  transactionCount!: Signal<number>;
  totalBalances!: Signal<{ currency: string; total: number }[]>;
  recentTransactions!: Signal<EnrichedTx[]>;
  accountNameMap!: Signal<Record<string, string>>;

  isMenuOpen = false;

  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    // Raw data signals
    this.accounts     = this.store.selectSignal(s => s.account.accounts || []);
    this.accLoading   = this.store.selectSignal(s => s.account.loading);
    this.transactions = this.store.selectSignal(s => s.transaction.transactions || []);
    this.txLoading    = this.store.selectSignal(s => s.transaction.loading);

    // Simple counts
    this.accountCount     = computed(() => this.accounts().length);
    this.transactionCount = computed(() => this.transactions().length);

    // Balances per currency
    this.totalBalances = computed(() => {
      const map: Record<string, number> = {};
      for (const acc of this.accounts()) {
        map[acc.currency] = (map[acc.currency] || 0) + acc.balance;
      }
      return Object.entries(map).map(([currency, total]) => ({ currency, total }));
    });

    // ID → Name map
    this.accountNameMap = computed(() =>
      Object.fromEntries(this.accounts().map(acc => [acc.id, acc.name]))
    );

    // Enriched recent transactions (last 5)
    this.recentTransactions = computed(() => {
      const nameMap = this.accountNameMap();
      return [...this.transactions()]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map(tx => ({
          ...tx,
          fromName: nameMap[tx.fromAccountId] ?? tx.fromAccountId,
          toName:   nameMap[tx.toAccountId]   ?? tx.toAccountId,
        }));
    });

    // Log errors
    effect(() => {
      const accErr = this.store.selectSnapshot((s: AppState) => s.account.error);
      const txErr  = this.store.selectSnapshot((s: AppState) => s.transaction.error);
      if (accErr) console.error('❌ Account state error:', accErr);
      if (txErr)  console.error('❌ Transaction state error:', txErr);
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadAccounts());
    this.store.dispatch(new LoadTransactions());
  }

  goTo(path: string) {
    this.router.navigate([path]);
    this.isMenuOpen = false;
  }
}
