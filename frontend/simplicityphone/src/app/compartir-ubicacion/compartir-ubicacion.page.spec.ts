import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompartirUbicacionPage } from './compartir-ubicacion.page';

describe('CompartirUbicacionPage', () => {
  let component: CompartirUbicacionPage;
  let fixture: ComponentFixture<CompartirUbicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartirUbicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
