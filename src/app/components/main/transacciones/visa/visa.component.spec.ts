import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaComponent } from './visa.component';

describe('VisaComponent', () => {
  let component: VisaComponent;
  let fixture: ComponentFixture<VisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
