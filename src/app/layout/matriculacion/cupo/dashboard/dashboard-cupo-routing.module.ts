import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardCupoComponent } from './dashboard-cupo.component';

const routes: Routes = [
    {
        path: '', component: DashboardCupoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardCupoRoutingModule {
}
