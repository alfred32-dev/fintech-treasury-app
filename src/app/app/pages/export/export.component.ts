import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { LoadTransactions } from '../../../core/models/states/transaction.state';
import { Transaction } from '../../../core/models/transaction.model';
import { ExportService } from '../../../core/services/export.service';
import { ToastService } from '../../../core/services/toast.service';

interface AppState {
  transaction: {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
  };
}

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  /** Signals for transaction list and loading */
  transactions!: Signal<Transaction[]>;
  loading     !: Signal<boolean>;

  constructor(
    private store: Store,
    private exportService: ExportService,
    private toast: ToastService
  ) {
    this.transactions = this.store.selectSignal(
      (s: AppState) => s.transaction.transactions
    );
    this.loading = this.store.selectSignal(
      (s: AppState) => s.transaction.loading
    );
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadTransactions());
  }

  onExportCSV() {
    const data = this.transactions();
    if (!data.length) {
      this.toast.error('No transactions to export.');
      return;
    }
    this.exportService.exportToCSV('transactions', data);
    this.toast.success('CSV export started.');
  }

  onExportPDF() {
    const data = this.transactions();
    if (!data.length) {
      this.toast.error('No transactions to export.');
      return;
    }
    this.exportService.exportToPDF('transactions', data);
    this.toast.success('PDF export started.');
  }
}
