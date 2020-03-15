import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilEstudianteSecretariaComponent } from './perfil-estudiante-secretaria.component';

const routes: Routes = [
    {
        path: '',
        component: PerfilEstudianteSecretariaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PerfilEstudianteSecretariaRoutingModule {}
