import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable coalesced zone change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // App routing
    provideRouter(routes),

    // Firebase Initialization
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Firebase Realtime Database
    provideDatabase(() => getDatabase()),
  ]
};
