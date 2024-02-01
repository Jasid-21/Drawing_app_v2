import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { SvgViewComponent } from './views/svg-view/svg-view.component';
import { FormEditorComponent } from './components/form-editor/form-editor.component';
import { StylesEditorComponent } from './components/styles-editor/styles-editor.component';
import { FormsModule } from '@angular/forms';
import { DrawingSpaceComponent } from './components/drawing-space/drawing-space.component';
import { LinearSliderComponent } from './components/linear-slider/linear-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    SvgViewComponent,
    FormEditorComponent,
    StylesEditorComponent,
    DrawingSpaceComponent,
    LinearSliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
