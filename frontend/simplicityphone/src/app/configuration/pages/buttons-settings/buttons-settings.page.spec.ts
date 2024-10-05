import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonsSettingsPage } from './buttons-settings.page';

describe('ButtonsSettingsPage', () => {
  let component: ButtonsSettingsPage;
  let fixture: ComponentFixture<ButtonsSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
