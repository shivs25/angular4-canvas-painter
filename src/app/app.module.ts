import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PainterLibraryModule } from './painter/painter-library.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PainterLibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
