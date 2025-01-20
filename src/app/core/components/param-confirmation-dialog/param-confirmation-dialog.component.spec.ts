import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamConfirmationDialogComponent } from './param-confirmation-dialog.component';

describe('ParamConfirmationDialogComponent', () => {
  let component: ParamConfirmationDialogComponent;
  let fixture: ComponentFixture<ParamConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
