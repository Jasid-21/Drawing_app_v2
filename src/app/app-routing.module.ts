import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { SvgViewComponent } from './views/svg-view/svg-view.component';

const routes: Routes = [
  { path: '', component: HomeViewComponent },
  { path: 'svg', component: SvgViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
