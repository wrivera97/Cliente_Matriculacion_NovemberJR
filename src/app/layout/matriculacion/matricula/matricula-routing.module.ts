import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MatriculaComponent} from './matricula.component';

const routes: Routes = [
  {
    path: '',
    component: MatriculaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule {
}
