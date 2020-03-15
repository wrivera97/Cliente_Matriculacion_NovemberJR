import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbCarouselModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {DashboardMatriculaRoutingModule} from './dashboard-matricula-routing.module';
import {DashboardMatriculaComponent} from './dashboard-matricula.component';


@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule,
        NgbAlertModule,
        DashboardMatriculaRoutingModule,
        FormsModule
    ],
    declarations: [
        DashboardMatriculaComponent
    ]
})
export class DashboardMatriculaModule {
}
