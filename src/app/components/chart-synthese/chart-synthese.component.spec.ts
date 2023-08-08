import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSyntheseComponent } from './chart-synthese.component';

describe('ChartSyntheseComponent', () => {
  let component: ChartSyntheseComponent;
  let fixture: ComponentFixture<ChartSyntheseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartSyntheseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartSyntheseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
