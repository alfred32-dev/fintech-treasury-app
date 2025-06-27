import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new Subject<Toast>();
  private defaultDuration = 4000; 

  /** Emits new toast */
  get toasts$(): Observable<Toast> {
    return this.toastsSubject.asObservable();
  }

  private show(message: string, type: ToastType, duration?: number) {
    const toast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      duration: duration ?? this.defaultDuration
    };
    this.toastsSubject.next(toast);
  }

  success(msg: string, duration?: number) {
    this.show(msg, 'success', duration);
  }

  error(msg: string, duration?: number) {
    this.show(msg, 'error', duration);
  }

  info(msg: string, duration?: number) {
    this.show(msg, 'info', duration);
  }
}
