import { Component, effect, inject, input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [DialogModule, UserProfileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userService = inject(UserService);
  user = this.userService.user;
  userId = this.user().id;

  title = input<string>('');
  showProfile: boolean = false;

  darkModeActive = signal(this.user().settings.darkmode || false);
  constructor () {
    this.setDarkmode();
     effect(() => {
      const user = this.user();

      if (this.user().id != this.userId) {
        this.userId = this.user().id;
        this.darkModeActive.set(this.user().settings.darkmode || false);
        this.setDarkmode();
      }
     });
  }

  onShowProfile() {
    this.showProfile = true;
  }
  onProfileClose(action: string) {
    this.showProfile = false;
  }

  setDarkmode() {
    const htmlElement = document.documentElement;
    if (this.darkModeActive()) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  toggleDarkMode() {
    this.darkModeActive.set(!this.darkModeActive());

    this.setDarkmode();

    this.user().settings = {...this.user().settings, darkmode: this.darkModeActive()}
    this.userService.editUser(this.user());
  }
}
