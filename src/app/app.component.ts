import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  toast = inject(ToastService);
  title = `What's Next`;

  constructor() {
    this.toast.show("Welcome to Syntra NPE App", "text-white text-3xl !bg-red-500");
  }
  
}
