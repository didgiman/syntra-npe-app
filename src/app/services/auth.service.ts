import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

interface LoginResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userService = inject(UserService);
  urlApi = 'http://localhost:8000/api';

  async login(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new Error('Both email and password are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const loginData = { email, password };

    try {
      const response = await fetch(`${this.urlApi}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Login failed.');
      }

      const data = await response.json();
      this.userService.loadUser(data.user.id);
      return data;
    } catch (error: any) {
      throw new Error(
        error.message || 'An unexpected error occurred. Please try again later.'
      );
    }
  }

  logout() {
    localStorage.removeItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
  // register a new user
  async registerUser(
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ) {
    try {
      // check if an email address is already in use
      const existingUserResponse = await fetch(
        `${this.urlApi}/users?email=${email}`
      );
      const existingUser = await existingUserResponse.json();

      if (existingUserResponse.ok) {
        const existingUserWithEmail = existingUser.find(
          (user: { email: string }) => user.email === email
        );
        if (existingUserWithEmail) {
          throw new Error('Email address is already in use');
        }
      }

      // create new user
      const response = await fetch(`${this.urlApi}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, first_name, last_name }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
