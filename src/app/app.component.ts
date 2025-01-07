import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.components.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = `What's Next`;
}
