import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-footer',
  imports: [ DialogModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  showPrivacyDialog: boolean = false;

  onPrivacyClick() {
    this.showPrivacyDialog = true;
  }
}
