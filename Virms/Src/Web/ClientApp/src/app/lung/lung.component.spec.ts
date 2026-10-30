import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LungComponent } from './lung.component';
import { LungService } from './lung.service';
import { LungEngine3dService } from './lungengine3d.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {MatSidenavModule} from '@angular/material/sidenav';
import {GatingEngine3dService} from '../shared/ui/gatingengine3d.service';

describe('LungComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LungComponent],
      imports: [MatSidenavModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: 'BASE_URL', useValue: '/api' },
        { provide: 'PROD_MODE', useValue: '/api' },
        LungService,
        {
          provide: LungEngine3dService, useValue: {
            createScene: vi.fn(),
            animate: vi.fn(),
            setTransparent: vi.fn(),
            ngOnDestroy: vi.fn()
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
    const fixture = TestBed.createComponent(LungComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
