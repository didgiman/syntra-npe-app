import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UtilsService } from './services/utils.service';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  utils = inject(UtilsService);
  title = `What's Next`;

  constructor() {
    this.utils.toast("Welcome to Syntra NPE's - What's Next", "warning");
  }
  
}
