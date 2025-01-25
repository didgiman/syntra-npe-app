import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  isPopupVisible = false;
  isLoginFormVisible = true;  // Show the login form initially
  isRegisterFormVisible = false;  // Register form is hidden initially
  isPasswordFormVisible = false;  // Forgot password form is hidden initially

  email: string = '';  // Bind email input
  password: string = '';  // Bind password input

  // Show the login popup
  showLoginPopup() {
    this.isPopupVisible = true;
  }

  // Close the popup
  closePopup() {
    this.isPopupVisible = false;
  }

  // Close the popup when 'Esc' key is pressed
  @HostListener('document:keydown', ['$event'])
  closeOnEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closePopup();
    }
  }

  // Switch to the Register form
  switchToRegisterForm() {
    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = true;
    this.isPasswordFormVisible = false;  // Hide forgot password form
  }

  // Switch to the Login form
  switchToLoginForm() {
    this.isLoginFormVisible = true;
    this.isRegisterFormVisible = false;
    this.isPasswordFormVisible = false;  // Hide forgot password form
  }

  // Switch to the Forgot Password form
  switchToPasswordForm() {
    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = false;
    this.isPasswordFormVisible = true;
  }

  // Handle login form submission
  handleLoginSubmit(event: Event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    const payload = {
      email: this.email,
      password: this.password
    };

    // Call your AuthService to login
    // For example, this.authService.login(payload);
    console.log(payload);  // Just for testing purposes
  }

  // Handle password recovery submission
  handlePasswordRecoverySubmit(event: Event) {
    event.preventDefault();

    const recoveryPayload = {
      email: this.email
    };

    // Call your AuthService to send recovery email
    // For example, this.authService.sendRecoveryEmail(recoveryPayload);
    console.log(recoveryPayload);  // Just for testing purposes
  }
}