import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueComponent } from './parque.component';

describe('ParqueComponent', () => {
  let component: ParqueComponent;
  let fixture: ComponentFixture<ParqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
