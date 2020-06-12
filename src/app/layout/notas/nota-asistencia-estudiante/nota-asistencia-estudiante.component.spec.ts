import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaAsistenciaEstudianteComponent } from './nota-asistencia-estudiante.component';

describe('NotaAsistenciaEstudianteComponent', () => {
  let component: NotaAsistenciaEstudianteComponent;
  let fixture: ComponentFixture<NotaAsistenciaEstudianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaAsistenciaEstudianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaAsistenciaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
