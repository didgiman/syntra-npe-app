import { Component, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-header',
  imports: [DialogModule, UserProfileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title = input<string>('');
  showProfile: boolean = false;

  darkModeActive = true;

  onShowProfile() {
    this.showProfile = true;
  }
  onProfileClose(action: string) {
    this.showProfile = false;
  }

  toggleDarkMode() {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
    } else {
      htmlElement.classList.add('dark');
    }

    this.darkModeActive = !this.darkModeActive;
  }
}
