import { Injectable } from '@angular/core';
import { Database, ref, set } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class FirebaseTestService {
  constructor(private db: Database) {}

  testConnection(): Promise<void> {
    const testRef = ref(this.db, 'test-connection');
    return set(testRef, {
      status: 'Connected successfully!',
      timestamp: new Date().toISOString()
    });
  }
}
