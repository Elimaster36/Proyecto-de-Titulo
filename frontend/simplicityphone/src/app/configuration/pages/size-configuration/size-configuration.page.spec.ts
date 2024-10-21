import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizeConfigurationPage } from './size-configuration.page';

describe('SizeConfigurationPage', () => {
  let component: SizeConfigurationPage;
  let fixture: ComponentFixture<SizeConfigurationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
