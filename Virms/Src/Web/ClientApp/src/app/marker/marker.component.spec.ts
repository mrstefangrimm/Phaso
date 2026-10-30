import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MarkerComponent } from './marker.component';
import { MarkerService } from './marker.service';
import { MarkerEngine3dService } from './markerengine3d.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {MatSidenavModule} from '@angular/material/sidenav';
import {GatingEngine3dService} from '../shared/ui/gatingengine3d.service';

describe('MarkerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkerComponent],
      imports: [MatSidenavModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: 'BASE_URL', useValue: '/api' },
        { provide: 'PROD_MODE', useValue: '/api' },
        MarkerService,
        {
          provide: MarkerEngine3dService, useValue: {
            createScene: vi.fn(),
            animate: vi.fn(),
            setTransparent: vi.fn(),
            ngOnDestroy: vi.fn(),
          }
        },
        {
          provide: GatingEngine3dService, useValue: {
            createScene: vi.fn(),
            animate: vi.fn(),
            setTransparent: vi.fn(),
            ngOnDestroy: vi.fn()
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MarkerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
