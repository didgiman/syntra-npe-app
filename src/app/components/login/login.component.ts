import { Component, HostListener, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class PopupComponent {
  // popup logic for switching views.
  isPopupVisible = false;
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

  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
  ) {}



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

  
  // handle login form submission
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
          // call the login service
          const response = await this.loginService.login(this.email, this.password);
          console.log('Login successful:', response);

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
      this.lastName,
    );



    console.log (result);


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

   // fetch all users with ngonit
   ngOnInit() {
    this.registerService.getAllUser().then((users) => {
      console.log(users);
      this.displayUsers.set(users);
    })
  }

}
