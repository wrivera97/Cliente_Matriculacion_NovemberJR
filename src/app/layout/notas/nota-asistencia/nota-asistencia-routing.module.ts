import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotaAsistenciaComponent} from './nota-asistencia.component';

const routes: Routes = [
    {
        path: '',
        component: NotaAsistenciaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class    NotaAsistenciaRoutingModule {
}
