import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotaAsistenciaEstudianteComponent} from './nota-asistencia-estudiante.component';

const routes: Routes = [
    {
        path: '',
        component: NotaAsistenciaEstudianteComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
    exports: [ RouterModule]
})
export class NotaAsistenciaEstudianteRoutingModule { }
