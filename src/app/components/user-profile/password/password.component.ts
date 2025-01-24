import { Component, inject, output, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-password',
  imports: [FormsModule, InputTextModule, ButtonModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  userService = inject(UserService);
  utils = inject(UtilsService);
  close = output();

  @ViewChild('form') form!: NgForm;  // Get reference to the form

  oldPassword = '';
  newPassword = '';
  newPassword_again = '';

  async onSave() {
    const saveResponse = await this.userService.updatePassword({ 
      old_password: this.oldPassword,
      new_password: this.newPassword
    });

    if (saveResponse) {
      this.utils.toast(saveResponse.message, saveResponse.success ? 'success' : 'error');
      if (saveResponse.success) {
        // this.close.emit('save');

        this.form.resetForm();

        this.oldPassword = '';
        this.newPassword = '';
        this.newPassword_again = '';
      }
    } else {
      this.utils.toast("Password could not be changed. Please try again.", "error");
    }
  }

  formValidator(form: NgForm) {
    if (this.newPassword === this.oldPassword) {
      form.control.setErrors({ passwordsMatch: true });
    } else if (this.newPassword != this.newPassword_again) {
      form.control.setErrors({ newPasswordsDontMatch: true });
    } else {
      form.control.setErrors(null);
    }
  }

  onCancel() {
    this.close.emit();
  }
}
