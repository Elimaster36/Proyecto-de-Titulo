import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackgroundSettingsPage } from './background-settings.page';

describe('BackgroundSettingsPage', () => {
  let component: BackgroundSettingsPage;
  let fixture: ComponentFixture<BackgroundSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
