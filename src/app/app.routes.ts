import { Routes } from '@angular/router';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { TransactionsComponent } from './app/pages/transactions/transactions.component';
import { TransferComponent } from './app/pages/transfer/transfer.component';
import { ExportComponent } from './app/pages/export/export.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Main Pages
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'export', component: ExportComponent },

  // Fallback Route
  { path: '**', redirectTo: '/dashboard' }
];
