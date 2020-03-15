import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CupoRoutingModule} from './cupo-routing.module';
import {CupoComponent} from './cupo.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';


@NgModule({
    imports: [CommonModule, CupoRoutingModule, FormsModule, PdfViewerModule, NgbModule],
    declarations: [CupoComponent]
})
export class CupoModule {
}
