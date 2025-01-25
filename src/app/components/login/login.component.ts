import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  isPopupVisible = false;
  isLoginFormVisible = true;
  isRegisterFormVisible = false;
  isPasswordFormVisible = false;

  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  // Show the login popup
  showLoginPopup() {
    this.isPopupVisible = true;
  }

  // Close the popup
  closePopup() {
    this.isPopupVisible = false;
    this.errorMessage = null;
  }

  @HostListener('document:keydown', ['$event'])
  closeOnEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closePopup();
    }
  }

  // Switch between forms
  switchToRegisterForm() {
    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = true;
    this.isPasswordFormVisible = false;
  }

  switchToLoginForm() {
    this.isLoginFormVisible = true;
    this.isRegisterFormVisible = false;
    this.isPasswordFormVisible = false;
  }

  switchToPasswordForm() {
    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = false;
    this.isPasswordFormVisible = true;
  }

  // Handle login form submission
  handleLoginSubmit(event: Event) {
    event.preventDefault();

    const payload = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        this.closePopup();
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }
}