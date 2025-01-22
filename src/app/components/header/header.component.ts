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

  onShowProfile() {
    this.showProfile = true;
  }
  onProfileClose(action: string) {
    this.showProfile = false;
  }
}
