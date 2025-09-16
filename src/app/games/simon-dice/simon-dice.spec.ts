import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimonDice } from './simon-dice';

describe('SimonDice', () => {
  let component: SimonDice;
  let fixture: ComponentFixture<SimonDice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimonDice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimonDice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
