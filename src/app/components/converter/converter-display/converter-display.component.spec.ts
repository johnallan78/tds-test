import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterDisplayComponent } from './converter-display.component';

describe('ConverterDisplayComponent', () => {
  let component: ConverterDisplayComponent;
  let fixture: ComponentFixture<ConverterDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConverterDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
