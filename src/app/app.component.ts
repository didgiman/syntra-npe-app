import { Component, inject, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UtilsService } from './services/utils.service';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  utils = inject(UtilsService);
  title = `What's Next`;

  constructor() {
    this.utils.toast("Welcome to Syntra NPE's - What's Next", "warning");
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
