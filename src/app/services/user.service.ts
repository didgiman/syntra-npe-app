import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users';
  private userId = Number(localStorage.getItem('userId') || '1'); // This should be the id of the logged in user

  user = signal<User>({
    id: this.userId,
    first_name: '',
    last_name: '',
    email: '',
    settings: {
      chatgpt: {
        motivational: false,
        functional: false
      },
      darkmode: false
    }
  });

  users = signal<User[]>([]);

  constructor() {
    this.loadAllUsers();
    this.loadUser(this.userId);
  }

  async loadAllUsers() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();

      this.users.set(data);
    } catch (error) {
      console.error(error);
    }
  }

  async loadUser(id: number): Promise<any> {
    try {

      localStorage.setItem('userId', id.toString());

      const response = await fetch(this.apiUrl + '/' + id);
      const data = await response.json();

      const user = { ...data.user, settings: this.formatSettings(data.user.settings)};

      this.user.set(user);

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async editUser(user: any): Promise<any> {

    try {

      user.settings = JSON.stringify(user.settings);

      const response = await fetch(this.apiUrl + '/' + user.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();

      if (data.success) {
        const updatedUser = { ... data.user, settings: this.formatSettings(data.user.settings)};
        console.log(updatedUser);

        this.user.set(updatedUser);

        this.users.update(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(passwords: any): Promise<any> {

    try {
      const requestBody = { ...passwords, id: this.user().id }

      const response = await fetch('http://localhost:8000/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // Settings is an escaped JSON string. We need to cpnvert it to a JS object
  private formatSettings(settings: any) {
    if (!settings) {
      return {
        chatgpt: {
          motivational: false,
          functional: false
        },
        darkmode: false
      };
    }
    settings = settings.replace(/\"/g, '"');
    settings = JSON.parse(settings);
    return settings;
  }
}
