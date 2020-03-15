import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilEstudianteComponent } from './perfil-estudiante.component';

const routes: Routes = [
    {
        path: '',
        component: PerfilEstudianteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PerfilEstudianteRoutingModule {}
