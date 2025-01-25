import { Component, HostListener, Signal, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  // logic for switching views.
  isPopupVisible = false;
  isLoginFormVisible = true;
  isRegisterFormVisible = false;
  isPasswordFormVisible = false;

  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

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
  async handleLoginSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Both email and password are required.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    // for debugging
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // pepare the data to be send
    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.errorMessage = null;

    try {
      // send a post request to the login endpoint
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(loginData),
      });

      // handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json();
        this.errorMessage = errorData.errorMessage || 'Login failed.';
        return;
      }

      // parse the successful response
      const data = await response.json();
      console.log('login successful:', data);

      alert('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'An unexpected error occured. Please try again later.';
    }
  }

  // handle register submit
  handleRegisterSubmit() {
    
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      console.log('Validation failed: Missing required fields');
      this.errorMessage = 'All fields are required.';
      return;

    if (!this.isValidEmail(this.email)) {
      console.log('Validation failed: Invalid email');
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.password.length < 6) {
      console.log('Validation failed: Password too short');
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    console.log('All validations passed');
    console.log('Registration successful:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    });

    alert('Registration successful!');
    this.resetForm();

    console.log('Form submitted!');
  }

  // helper function to validate the email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // resets the form fields
  private resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  // handle password recovery
  handlePasswordRecoverySubmit() {
    if (!this.isValidEmail(this.email)) {
      console.log('Validation failed: Invalid email');
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    console.log('Recovery email send to:', {
      email: this.email
    });

    this.resetForm();
  }
    }
