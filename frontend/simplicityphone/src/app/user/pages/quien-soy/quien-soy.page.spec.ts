import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuienSoyPage } from './quien-soy.page';

describe('QuienSoyPage', () => {
  let component: QuienSoyPage;
  let fixture: ComponentFixture<QuienSoyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuienSoyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
