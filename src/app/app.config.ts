import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';

import { provideStore } from '@ngxs/store';
import { AccountState } from './core/models/states/account.state';
import { TransactionState } from './core/models/states/transaction.state';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable coalesced zone change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // HTTP client with interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // App routing
    provideRouter(routes),

    // Firebase Modular Initialization (for modern APIs)
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Firebase Realtime Database (modular)
    provideDatabase(() => getDatabase()),

    // ✅ AngularFire compat for services like AngularFireDatabase
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),

    // NGXS store setup with our feature states
    provideStore([
      AccountState,
      TransactionState
    ]),
  ]
};
