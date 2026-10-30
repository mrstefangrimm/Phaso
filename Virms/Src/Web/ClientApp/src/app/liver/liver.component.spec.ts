import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LiverComponent } from './liver.component';
import { LiverService } from './liver.service';
import { LiverEngine3dService } from './liverengine3d.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {MatSidenavModule} from '@angular/material/sidenav';
import {GatingEngine3dService} from '../shared/ui/gatingengine3d.service';

describe('LiverComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiverComponent],
      imports: [MatSidenavModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: 'BASE_URL', useValue: '/api' },
        { provide: 'PROD_MODE', useValue: '/api' },
        LiverService,
        {
          provide: LiverEngine3dService, useValue: {
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
    const fixture = TestBed.createComponent(LiverComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
