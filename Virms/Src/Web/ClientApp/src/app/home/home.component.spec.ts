import { describe, it, expect, beforeEach } from 'vitest'
import { HomeComponent } from './home.component'

describe('HomeComponent', () => {
  let component: HomeComponent

  beforeEach(() => {
    component = new HomeComponent()
  })

  describe('initial state', () => {
    it('should have all phantom flags false', () => {
      expect(component.markerPhantomActive).toBe(false)
      expect(component.liverPhantomActive).toBe(false)
      expect(component.lungPhantomActive).toBe(false)
      expect(component.isocalPhantomActive).toBe(false)
      expect(component.lnrActuatorActive).toBe(false)
    })

    it('should have sideNavOpen false', () => {
      expect(component.sideNavOpen).toBe(false)
    })
  })

  describe('showHome()', () => {
    it('should return true when no phantom is active', () => {
      expect(component.showHome()).toBe(true)
    })

    it('should return false when a phantom is active', () => {
      component.onMarkerPhantomClicked()
      expect(component.showHome()).toBe(false)
    })
  })

  describe('onMarkerPhantomClicked()', () => {
    it('should activate markerPhantom and deactivate others', () => {
      component.onLiverPhantomClicked()
      component.onMarkerPhantomClicked()

      expect(component.markerPhantomActive).toBe(true)
      expect(component.liverPhantomActive).toBe(false)
      expect(component.lungPhantomActive).toBe(false)
      expect(component.isocalPhantomActive).toBe(false)
      expect(component.lnrActuatorActive).toBe(false)
      expect(component.sideNavOpen).toBe(false)
    })
  })

  describe('onLiverPhantomClicked()', () => {
    it('should activate liverPhantom and deactivate others', () => {
      component.onMarkerPhantomClicked()
      component.onLiverPhantomClicked()

      expect(component.markerPhantomActive).toBe(false)
      expect(component.liverPhantomActive).toBe(true)
      expect(component.lungPhantomActive).toBe(false)
      expect(component.isocalPhantomActive).toBe(false)
      expect(component.lnrActuatorActive).toBe(false)
      expect(component.sideNavOpen).toBe(false)
    })
  })

  describe('onLungPhantomClicked()', () => {
    it('should activate lungPhantom and deactivate others', () => {
      component.onLungPhantomClicked()

      expect(component.markerPhantomActive).toBe(false)
      expect(component.liverPhantomActive).toBe(false)
      expect(component.lungPhantomActive).toBe(true)
      expect(component.isocalPhantomActive).toBe(false)
      expect(component.lnrActuatorActive).toBe(false)
      expect(component.sideNavOpen).toBe(false)
    })
  })

  describe('onIsocalPhantomClicked()', () => {
    it('should activate isocalPhantom and deactivate others', () => {
      component.onIsocalPhantomClicked()

      expect(component.markerPhantomActive).toBe(false)
      expect(component.liverPhantomActive).toBe(false)
      expect(component.lungPhantomActive).toBe(false)
      expect(component.isocalPhantomActive).toBe(true)
      expect(component.lnrActuatorActive).toBe(false)
      expect(component.sideNavOpen).toBe(false)
    })
  })

  describe('onLnrActuatorClicked()', () => {
    it('should activate lnrActuator and deactivate others', () => {
      component.onLnrActuatorClicked()

      expect(component.markerPhantomActive).toBe(false)
      expect(component.liverPhantomActive).toBe(false)
      expect(component.lungPhantomActive).toBe(false)
      expect(component.isocalPhantomActive).toBe(false)
      expect(component.lnrActuatorActive).toBe(true)
      expect(component.sideNavOpen).toBe(false)
    })
  })

  describe('ngOnInit()', () => {
    it('should not throw', () => {
      expect(() => component.ngOnInit()).not.toThrow()
    })
  })
})
