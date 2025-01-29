import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UtilsService } from './services/utils.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent, HeaderComponent, CommonModule, LoginComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  utils = inject(UtilsService);
  userService = inject(UserService);
  user = this.userService.user;

  title = `What's Next`;
  
  constructor() {
    this.utils.toast("Welcome to What's Next", "warning");

    effect(() => {
      this.title = `What's Next, ${this.user().first_name}!`;
    });
  }

  logout() {
    this.authService.logout();
  }
}
