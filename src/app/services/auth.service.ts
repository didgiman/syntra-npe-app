import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userService = inject(UserService);
  utils = inject(UtilsService);
  urlApi = 'http://localhost:8000/api';

  // async login(email: string, password: string): Promise<any> {
  //   if (!email || !password) {
  //     this.utils.toast('Both email and password are required.');
  //     throw new Error('Both email and password are required.');
  //   }

  //   if (password.length < 6) {
  //     this.utils.toast('Please enter a valid email address.');
  //     throw new Error('Password must be at least 6 characters long.');
  //   }

  //   const loginData = { email, password };

  //   try {
  //     const response = await fetch(`${this.urlApi}/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(loginData),
  //     });

  //     if (!response.ok) {
  //       const errorResponse = await response.json();
  //       this.utils.toast(errorResponse.message, 'Login failed.');
  //       throw new Error(errorResponse.message);
  //     }

  //     const data = await response.json();
  //     await this.userService.loadUser(data.user.id);
  //     this.utils.toast('Successfully logged in!');
  //     return data;
  //   } catch (error: any) {
  //     if (!error.message || error.message.includes('unexpected error')) {
  //       this.utils.toast(
  //         'An unexpected error occurred. Please try again later.'
  //       );
  //     }
  //     throw error;
  //   }
  // }

  async login(email: string, password: string): Promise<any> {
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
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw error;
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
email: string, password: string, first_name: string, last_name: string, lastName: string  ) {
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
      if (!response.ok) {
        const errorResponse = await response.json();
        this.utils.toast(errorResponse.message, 'Registration failed.');
        throw new Error(errorResponse.message);
      }

      const data = await response.json();
      // await this.userService.loadUser(data.user.id); => automatically logs the user in after succesful registration
      this.utils.toast('User was created succesfully.');
      return data;
    } catch (error: any) {
      if (!error.message || error.message.includes('unexpected error')) {
        this.utils.toast(
          'An unexpected error occurred. Please try again later.'
        );
      }
      throw error;
    }
  }
}
