import { Component } from '@angular/core';
import { FooterComponent } from "../../../components/shared/layout/footer/footer.component";
import { FirebaseTestService } from '../../../core/services/firebase.test.service';

@Component({
  selector: 'app-dashboard',
  imports: [FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {



constructor(private firebaseTest: FirebaseTestService){}
  runFirebaseTest() {
    this.firebaseTest.testConnection()
      .then(() => console.log('✅ Firebase test successful'))
      .catch(err => console.error('❌ Firebase test failed', err));
  }
}

