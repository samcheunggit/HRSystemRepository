import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavetableComponent } from './leavetable.component';

describe('LeavetableComponent', () => {
  let component: LeavetableComponent;
  let fixture: ComponentFixture<LeavetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
