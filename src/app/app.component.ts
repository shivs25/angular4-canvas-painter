import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  onPaintStart(): void {
    console.log("paint started");
  }

  onPaintEnd(): void {
    console.log("paint ended");
  }
}
