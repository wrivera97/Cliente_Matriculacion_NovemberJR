import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {MatriculaRoutingModule} from './matricula-routing.module';
import {MatriculaComponent} from './matricula.component';


@NgModule({
    imports: [FormsModule, CommonModule, MatriculaRoutingModule, NgbModule],
    declarations: [MatriculaComponent]
})
export class MatriculaModule {
}
