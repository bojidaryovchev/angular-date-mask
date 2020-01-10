import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgDateMaskModule } from './ngDateMask/ngDateMask.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgDateMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
