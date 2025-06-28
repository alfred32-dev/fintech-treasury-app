import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureTransfersComponent } from './future-transfers.component';

describe('FutureTransfersComponent', () => {
  let component: FutureTransfersComponent;
  let fixture: ComponentFixture<FutureTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutureTransfersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
