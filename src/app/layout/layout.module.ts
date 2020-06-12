import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {LayoutRoutingModule} from './layout-routing.module';
import {LayoutComponent} from './layout.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {HeaderComponent} from './components/header/header.component';
import { NotaAsistenciaEstudianteComponent } from './notas/nota-asistencia-estudiante/nota-asistencia-estudiante.component';


@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule,
        FormsModule
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent, NotaAsistenciaEstudianteComponent]
})
export class LayoutModule {
}
