import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualComponent } from './visual.component';

describe('VisualComponent', () => {
  let component: VisualComponent;
  let fixture: ComponentFixture<VisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
