import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DocenteAsignaturaComponent} from './docente-asignatura.component';

const routes: Routes = [
    {
        path: '',
        component: DocenteAsignaturaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocenteAsignaturaRoutingModule {
}
