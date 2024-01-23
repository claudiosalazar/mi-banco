import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaCreditoComponent } from './linea-credito.component';

describe('LineaCreditoComponent', () => {
  let component: LineaCreditoComponent;
  let fixture: ComponentFixture<LineaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineaCreditoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
