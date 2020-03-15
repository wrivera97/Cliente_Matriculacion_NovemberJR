import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaEstudianteDocenteComponent } from './eva-estudiante-docente.component';

const routes: Routes = [
    {
        path: '',
        component: EvaEstudianteDocenteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EvaEstudianteDocenteRoutingModule {}
