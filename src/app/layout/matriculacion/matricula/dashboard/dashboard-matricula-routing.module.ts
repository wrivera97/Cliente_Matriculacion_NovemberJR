import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardMatriculaComponent } from './dashboard-matricula.component';

const routes: Routes = [
    {
        path: '', component: DashboardMatriculaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardMatriculaRoutingModule {
}
