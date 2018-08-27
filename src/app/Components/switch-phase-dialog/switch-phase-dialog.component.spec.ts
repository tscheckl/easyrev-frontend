import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchPhaseDialogComponent } from './switch-phase-dialog.component';

describe('SwitchPhaseDialogComponent', () => {
  let component: SwitchPhaseDialogComponent;
  let fixture: ComponentFixture<SwitchPhaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchPhaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchPhaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
