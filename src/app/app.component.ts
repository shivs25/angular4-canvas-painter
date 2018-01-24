import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  clipBounds = { x: 100, y: 100, width: 200, height: 200 };

  onPaintStart(): void {
    console.log("paint started");
  }

  onPaintEnd(): void {
    console.log("paint ended");
  }

  onUndoLengthChanged(e): void {
    console.log(e);
  }

  onRedoLengthChanged(e): void {
    console.log(e);
  }

  onIsEmptyChanged(e): void {
    console.log(e);
  }
}
