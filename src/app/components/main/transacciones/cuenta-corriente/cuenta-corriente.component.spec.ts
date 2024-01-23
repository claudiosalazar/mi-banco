import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaCorrienteComponent } from './cuenta-corriente.component';

describe('CuentaCorrienteComponent', () => {
  let component: CuentaCorrienteComponent;
  let fixture: ComponentFixture<CuentaCorrienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaCorrienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaCorrienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
