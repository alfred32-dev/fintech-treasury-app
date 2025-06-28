import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './components/shared/layout/top-bar/top-bar.component';
import { FirebaseTestService } from './core/services/firebase.test.service';
import { ToastComponent } from "./components/shared/toast/toast.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fintech-treasury-app';

  constructor() {}

}
