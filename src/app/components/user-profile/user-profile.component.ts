import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../services/user.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { UtilsService } from '../../services/utils.service';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, ButtonModule, InputTextModule, ToggleSwitchModule, TabsModule ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  close = output<string>();
  utils = inject(UtilsService);

  userService = inject(UserService);
  user = this.userService.user;

  constructor() {
    
  }

  onCancel() {
    console.log('Cancel clicked');
    this.close.emit('cancel');
  }
  
  async onSave() {
    console.log('Save clicked');

    console.log(this.user())
    const saveResponse = await this.userService.editUser({ ...this.user() });

    console.log(saveResponse);

    if (saveResponse) {
      this.utils.toast(saveResponse.message, saveResponse.success ? 'success' : 'error');
      if (saveResponse.success) {
        // this.close.emit('save');
      }
    } else {
      this.utils.toast("User could not be saved. Please try again.", "error");
    }




    // this.close.emit('save');
  }
}
