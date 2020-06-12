import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotaAsistenciaDocenteComponent} from './nota-asistencia-docente.component';

const routes: Routes = [
    {
        path: '',
        component: NotaAsistenciaDocenteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class    NotaAsistenciaDocenteRoutingModule {
}
