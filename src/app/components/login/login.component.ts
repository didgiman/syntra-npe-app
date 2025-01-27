import { inject, Component, HostListener, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // logic for switching views.
  isLoginFormVisible = true;
  isRegisterFormVisible = false;
  isPasswordFormVisible = false;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;

  displayUsers = signal<any[]>([]);

  // Inject the services
  private authService = inject(AuthService);
  private registerService = inject(RegisterService);

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

  async onLogin() {
    try {
      const response = await this.authService.login(this.email, this.password);
    } catch (error: any) {
      this.errorMessage = error.message;
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
    }

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

    let result = this.registerService.registerUser(
      this.email,
      this.password,
      this.firstName,
      this.lastName
    );

    console.log(result);

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
      email: this.email,
    });

    this.resetForm();
  }
}
