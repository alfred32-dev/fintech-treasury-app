// src/app/features/accounts-list/accounts-list.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css'],
})
export class AccountsListComponent {
  @Input() accounts: Account[] = [];

  currencyFilter: string = '';
  textFilter: string = '';

  /** Unique list of currencies to populate the dropdown */
  get currencies(): string[] {
    return Array.from(new Set(this.accounts.map(a => a.currency))).sort();
  }

  /** The filtered and searchable list */
  get filteredAccounts(): Account[] {
    return this.accounts
      .filter(acc =>
        this.currencyFilter
          ? acc.currency === this.currencyFilter
          : true
      )
      .filter(acc =>
        this.textFilter
          ? acc.name.toLowerCase().includes(this.textFilter.toLowerCase())
          : true
      );
  }
}
