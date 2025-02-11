import { inject, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';

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
  utils = inject(UtilsService);
  userService = inject(UserService);

  // Switch between forms
  switchToRegisterForm() {
    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = true;
    this.isPasswordFormVisible = false;
    this.resetForm();
  }

  switchToLoginForm() {
    this.isLoginFormVisible = true;
    this.isRegisterFormVisible = false;
    this.isPasswordFormVisible = false;
    this.resetForm();
  }

  // switchToPasswordForm() {
  //   this.isLoginFormVisible = false;
  //   this.isRegisterFormVisible = false;
  //   this.isPasswordFormVisible = true;
  //   this.resetForm();
  // }

  // async onLogin() {
  //   if (!this.email || !this.password) {
  //     this.utils.toast('Both email and password are required.', 'Login failed.');
  //     return;
  //   }

  //   if (this.password.length < 6) {
  //     this.utils.toast('Password must be at least 6 characters long.', 'Login failed.');
  //     return;
  //   }

  //   try {
  //     const response = await this.authService.login(this.email, this.password);

  //     if (!response.ok) {
  //       const errorResponse = await response.json();
  //       this.utils.toast(errorResponse.message, 'Login failed.');
  //       throw new Error(errorResponse.message);
  //     }

  //     await this.userService.loadUser(response.user.id);
  //     this.utils.toast('Successfully logged in!');
  //   } catch (error: any) {
  //     this.utils.toast(error.message, 'Login failed.');
  //     this.errorMessage = error.message;
  //   }
  // }

  async onLogin() {
    if (!this.email || !this.password) {
      this.utils.toast('Both email and password are required.', 'warning');
      return;
    }

    if (this.password.length < 6) {
      this.utils.toast('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.utils.toast('Please enter a valid email address.');
      return;
    }

    try {
      const response = await this.authService.login(this.email, this.password);
      if (response.success) {
        try {
          await this.userService.loadUser(response.user.id);
          this.utils.toast('Successfully logged in!');
        } catch (error: any) {
          console.error('Error loading user data:', error);
          this.utils.toast('Error loading user data.', 'error');
          this.errorMessage = error.message || 'Failed to load user data.';
        }
      } else {
        this.utils.toast(response.message, 'error');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle 401 errors with specific messages
      if (error.response?.status === 401) {
        if (error.message === 'User does not exist.') {
          this.utils.toast(
            'User does not exist. Please register first.',
            'Login failed.'
          );
        } else if (error.message === 'Invalid password.') {
          this.utils.toast(
            'Invalid password. Please try again.',
            'Login failed.'
          );
        } else {
          this.utils.toast(
            'Unauthorized access. Please check your credentials.',
            'Login failed.'
          );
        }
      } else if (
        error.message.includes('Both email and password are required')
      ) {
        this.utils.toast(error.message, 'Login failed.');
      } else if (
        error.message.includes('Password must be at least 6 characters long')
      ) {
        this.utils.toast(error.message, 'Login failed.');
      } else {
        this.utils.toast(
          'An unexpected error occurred. Please try again later.',
          'Login failed.'
        );
      }

      this.errorMessage = error.message || 'An unexpected error occurred.';
    }
  }

  // handle register submit
  async handleRegisterSubmit() {
    console.log(this.firstName);
    console.log(this.lastName);
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.utils.toast('All fields are required.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.utils.toast('Please enter a valid email address.');
      return;
    }

    if (this.password.length < 6) {
      this.utils.toast('Password must be at least 6 characters long.');
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.utils.toast('Passwords do not match');
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    await this.authService.registerUser(
      this.email,
      this.password,
      this.confirmPassword,
      this.firstName,
      this.lastName
    );

    this.switchToLoginForm();
    this.password = '';
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

  // // handle password recovery
  // handlePasswordRecoverySubmit() {
  //   if (!this.isValidEmail(this.email)) {
  //     console.log('Validation failed: Invalid email');
  //     this.errorMessage = 'Please enter a valid email address.';
  //     return;
  //   }
  //   console.log('Recovery email send to:', {
  //     email: this.email,
  //   });

  //   this.resetForm();
  // }
}
