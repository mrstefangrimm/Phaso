import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LnrComponent } from './lnr.component';
import { LnrService } from './lnr.service';
import { LnrEngine3dService } from './lnrengine3d.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {MatSidenavModule} from '@angular/material/sidenav';
import {TocService} from '../shared/remote/toc.service';

describe('LnrComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LnrComponent],
      imports: [MatSidenavModule],
      providers: [
        provideZonelessChangeDetection(),
        LnrService,
        {
          provide: LnrEngine3dService, useValue: {
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
    const fixture = TestBed.createComponent(LnrComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
