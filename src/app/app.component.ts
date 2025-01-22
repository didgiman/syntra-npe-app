import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UtilsService } from './services/utils.service';
import { HeaderComponent } from './components/header/header.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  utils = inject(UtilsService);
  userService = inject(UserService);
  user = this.userService.user;

  title = `What's Next`;

  darkModeActive = true;

  constructor() {
    this.utils.toast("Welcome to Syntra NPE's - What's Next", "warning");

    effect(() => {
      console.log('Updated user effect', this.user());

      this.title = `What's Next for ${this.user().first_name} ${this.user().last_name}`;
    });
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
