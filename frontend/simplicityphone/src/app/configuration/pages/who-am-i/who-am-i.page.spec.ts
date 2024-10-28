import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhoAmIPage } from './who-am-i.page';

describe('WhoAmIPage', () => {
  let component: WhoAmIPage;
  let fixture: ComponentFixture<WhoAmIPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoAmIPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
