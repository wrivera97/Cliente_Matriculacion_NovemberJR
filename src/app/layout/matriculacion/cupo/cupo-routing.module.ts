import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CupoComponent} from './cupo.component';

const routes: Routes = [
  {
    path: '',
    component: CupoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CupoRoutingModule {
}
