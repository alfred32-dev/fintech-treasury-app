// transfer-form.component.ts
import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';

import { Account } from '../../../core/models/account.model';
import { LoadAccounts, UpdateBalance } from '../../../core/models/states/account.state';
import { LoadTransactions, AddTransaction } from '../../../core/models/states/transaction.state';
import { StatusCode, Transaction } from '../../../core/models/transaction.model';
import { FxService } from '../../../core/services/fx.service';
import { ToastService } from '../../../core/services/toast.service';
import { SchedulerService } from '../../../core/services/scheduler.service';

@Component({
  selector: 'app-transfer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.css']
})
export class TransferFormComponent implements OnInit {
  form!: FormGroup;
  accounts!: Signal<Account[]>;
  accLoading!: Signal<boolean>;
  previewAmount?: number;
  previewCurrency?: string;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private fx: FxService,
    private toast: ToastService,
    private router: Router,
    private scheduler: SchedulerService
  ) {
    this.accounts = this.store.selectSignal(s => s.account.accounts);
    this.accLoading = this.store.selectSignal(s => s.account.loading);
  }

  ngOnInit() {
    this.store.dispatch([new LoadAccounts(), new LoadTransactions()]);
    this.form = this.fb.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      scheduleDate: [null],
      note: ['']
    });

    this.form.valueChanges.subscribe(({ from, to, amount }) => {
      if (from && to && amount != null) {
        const all = this.accounts();
        const src = all.find(a => a.id === from)!;
        const dst = all.find(a => a.id === to)!;
        this.previewCurrency = dst.currency;
        this.previewAmount = this.fx.convert(amount, src.currency, dst.currency);
      } else {
        this.previewAmount = undefined;
      }
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.toast.error('Please fill all required fields.');
      return;
    }

    const { from, to, amount, scheduleDate, note } = this.form.value;
    if (from === to) {
      this.toast.error('Source and destination must differ.');
      return;
    }

    const all = this.accounts();
    const src = all.find(a => a.id === from)!;
    const dst = all.find(a => a.id === to)!;

    const fxRate = src.currency === dst.currency
      ? 1
      : this.fx.convert(1, src.currency, dst.currency);

    if (!scheduleDate) {
      if (src.balance < amount) {
        this.toast.error('Insufficient balance.');
        return;
      }

      const received = parseFloat((amount * fxRate).toFixed(2));
      const newSrcBal = src.balance - amount;
      const newDstBal = dst.balance + received;

      const tx: Transaction = {
        id: `${Date.now()}`,
        fromAccountId: src.id,
        toAccountId: dst.id,
        amount,
        currency: src.currency,
        fxRate,
        status: StatusCode.Completed,
        timestamp: Date.now(),
        ...(note ? { note } : {})
      };

      this.submitting = true;
      try {
        await this.store.dispatch([
          new UpdateBalance(src.id, newSrcBal),
          new UpdateBalance(dst.id, newDstBal),
          new AddTransaction(tx)
        ]);
        this.toast.success('Transfer completed successfully.');
        this.form.reset();
        await this.router.navigate(['/dashboard']);
      } catch (err) {
        console.error(err);
        this.toast.error('Transfer failed.');
      } finally {
        this.submitting = false;
      }
    } else {
      const scheduled: Transaction = {
        id: `${Date.now()}`,
        fromAccountId: src.id,
        toAccountId: dst.id,
        amount,
        currency: src.currency,
        fxRate,
        status: StatusCode.Scheduled,
        timestamp: new Date(scheduleDate).getTime(),
        ...(note ? { note } : {})
      };

      this.submitting = true;
      this.scheduler.scheduleFutureTransfer(scheduled).subscribe({
        next: () => {
          this.toast.info('Transfer scheduled successfully.');
          this.form.reset();
        },
        error: err => {
          console.error(err);
          this.toast.error('Scheduling failed.');
        },
        complete: () => {
          this.submitting = false;
        }
      });
    }
  }
}
