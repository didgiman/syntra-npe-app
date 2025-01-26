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

  title = input<string>('');
  showProfile: boolean = false;

  // darkModeActive = signal(false);
  darkModeActive = signal(localStorage.getItem("darkmode") === 'true' || false);

  ngOnInit() {
    this.setDarkmode();
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
    localStorage.setItem("darkmode", String(this.darkModeActive()));
  }

  toggleDarkMode() {
    this.darkModeActive.set(!this.darkModeActive());

    this.setDarkmode();

    // this.user().settings = {...this.user().settings, darkmode: this.darkModeActive()}
    // this.userService.editUser(this.user());
  }
}
