import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasPainterComponent } from './canvas-painter/canvas-painter.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CanvasPainterComponent
  ],
  exports: [
    CanvasPainterComponent
  ]
})
export class PainterLibraryModule { }
