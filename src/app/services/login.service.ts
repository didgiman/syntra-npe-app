import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

urlApi = 'http://localhost:8000/api';

async getAllUser () {
  try {
    const response = await fetch(`${this.urlApi}/users`);
    return await response.json();
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

async registerUser(
  email: string, 
  password: string,
  first_name: string,
  last_name: string,
) {
  try {
    const response = await fetch(`${this.urlApi}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email,password,first_name,last_name}),
    });
    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

}