// src/app/services/fx.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CurrencyRates } from '../models/currency.model';

@Injectable({ providedIn: 'root' })
export class FxService {
  private ratesSubject = new BehaviorSubject<CurrencyRates>({
    // Direct pairs
    'USD:KES': 130,
    'KES:USD': +(1 / 130).toFixed(6),

    'USD:NGN': 770,
    'NGN:USD': +(1 / 770).toFixed(6),

    // Derived via USD
    'KES:NGN': +(770 / 130).toFixed(6), // ~5.923077
    'NGN:KES': +(130 / 770).toFixed(6)  // ~0.168831
  });

  getAllRates(): CurrencyRates {
    return this.ratesSubject.value;
  }

  getRates$(): Observable<CurrencyRates> {
    return this.ratesSubject.asObservable();
  }

  setRates(updated: CurrencyRates): Observable<boolean> {
    this.ratesSubject.next({ ...updated });
    return of(true);
  }

  convert(amount: number, from: string, to: string): number {
    if (from === to) return amount;
    const key = `${from}:${to}`;
    const rate = this.ratesSubject.value[key];
    if (rate == null) {
      console.error(`Missing FX rate for ${key}`);
      throw new Error(`FX rate not found for ${key}`);
    }
    return parseFloat((amount * rate).toFixed(2));
  }
}
