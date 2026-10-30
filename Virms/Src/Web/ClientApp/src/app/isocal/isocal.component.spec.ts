import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IsocalComponent } from './isocal.component';
import { IsocalService } from './isocal.service';
import { IsocalEngine3dService } from './isocalengine3d.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {MatSidenavModule} from '@angular/material/sidenav';

describe('IsocalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsocalComponent],
      imports: [MatSidenavModule],
      providers: [
        provideZonelessChangeDetection(),
        IsocalService,
        {
          provide: IsocalEngine3dService, useValue: {
            createScene: vi.fn(),
            animate: vi.fn(),
            setTransparent: vi.fn(),
            ngOnDestroy: vi.fn(),
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(IsocalComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
