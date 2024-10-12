import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AplicationsPage } from './aplications.page';

describe('AplicationsPage', () => {
  let component: AplicationsPage;
  let fixture: ComponentFixture<AplicationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
