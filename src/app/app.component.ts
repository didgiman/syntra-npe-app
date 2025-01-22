import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UtilsService } from './services/utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  utils = inject(UtilsService);
  title = `What's Next`;

  darkModeActive = true;

  constructor() {
    this.utils.toast("Welcome to Syntra NPE's - What's Next", "warning");
  }

  toggleDarkMode() {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
    } else {
      htmlElement.classList.add('dark');
    }

    this.darkModeActive = !this.darkModeActive;
  }
  
}
