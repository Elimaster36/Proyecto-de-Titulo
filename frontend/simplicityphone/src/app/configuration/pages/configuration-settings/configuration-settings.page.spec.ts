import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationSettingsPage } from './configuration-settings.page';

describe('ConfigurationSettingsPage', () => {
  let component: ConfigurationSettingsPage;
  let fixture: ComponentFixture<ConfigurationSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
