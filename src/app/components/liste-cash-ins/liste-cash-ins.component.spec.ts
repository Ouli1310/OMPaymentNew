import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCashInsComponent } from './liste-cash-ins.component';

describe('ListeCashInsComponent', () => {
  let component: ListeCashInsComponent;
  let fixture: ComponentFixture<ListeCashInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeCashInsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCashInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
