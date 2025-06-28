import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from '../../../components/shared/layout/footer/footer.component';
import { TransferFormComponent } from '../../../components/transfer/transfer-form/transfer-form.component';
import { FutureTransfersComponent } from '../../../components/transfer/future-transfers/future-transfers.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    TransferFormComponent,
    FooterComponent
  ],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {}
