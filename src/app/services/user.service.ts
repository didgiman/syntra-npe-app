import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users';
  private userId = 25;

  user = signal<any>({
    first_name: '',
    last_name: '',
    email: '',
    settings: {
      chatgpt: {
        motivational: false,
        functional: false
      }
    }
  });

  constructor() {
    this.loadUser(this.userId);;
  }

  async loadUser(id: number): Promise<any> {
    try {
      const response = await fetch(this.apiUrl + '/' + id);
      const data = await response.json();

      // console.log("loadUser", data);

      const user = { ... data.user, settings: this.formatSettings(data.user.settings)};
      // console.log(user);

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
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // Settings is an escaped JSON string. We need to cpnvert it to a JS object
  private formatSettings(settings: any) {
    settings = settings.replace(/\"/g, '"');
    settings = JSON.parse(settings);
    return settings;
  }
}
