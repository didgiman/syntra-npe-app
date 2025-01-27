import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

interface LoginResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
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
      localStorage.setItem('userId', data.user.id);
      this.userService.loadUser(data.user.id);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred. Please try again later.');
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
}