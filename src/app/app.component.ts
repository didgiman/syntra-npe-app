import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UtilsService } from './services/utils.service';
import { HeaderComponent } from './components/header/header.component';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent, HeaderComponent, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  utils = inject(UtilsService);
  userService = inject(UserService);
  user = this.userService.user;

  title = `What's Next`;

  constructor(
    public authService: AuthService,
  ) {
    this.utils.toast("Welcome to Syntra NPE's - What's Next", "warning");

    effect(() => {
      this.title = `What's Next for ${this.user().first_name} ${this.user().last_name}`;
    });
  }
  
  // All methods for the login / register screen
  isPopupVisible = false;
  isLoginFormVisible = true;

  // Method to show the popup and the login form
  showLoginPopup() {
    this.isPopupVisible = true;
    this.isLoginFormVisible = true;
  }

  // Method to close the popup
  closePopup() {
    this.isPopupVisible = false;
  }

  // Method to switch to the Register form
  switchToRegisterForm() {
    this.isLoginFormVisible = false;
  }

  // Method to switch to the Login form
  switchToLoginForm() {
    this.isLoginFormVisible = true;
  }
}
