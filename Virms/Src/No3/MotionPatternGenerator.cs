// Copyright (c) 2020-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.No3 {
  using System;
  using System.Collections.Generic;
  using System.Timers;

  public enum Cylinder { Upper, Lower, Platform }

  public class CylinderPosition {
    public Cylinder Cy;
    public ushort Lng;
    public ushort Rtn;
    public ushort StepSize;
  }

  public class MotionPatternGenerator : IDisposable {

    private const int PRESETTIMERINCR = 40;

    private Timer _timer;
    private int _preSetTimer;
    private int _currentProgramId;

    public MotionPatternGenerator(Action<IEnumerable<CylinderPosition>> handler) {
      _timer = new Timer();
      _timer.AutoReset = false;
      _timer.Interval = PRESETTIMERINCR;
      _timer.Elapsed += (o, e) => {
        switch (_currentProgramId) {
          default: Stop(); break;

          case 1: _prog1(handler); break;
          case 2: _prog2(handler); break;
          case 3: _prog3(handler); break;
          case 4: _prog4(handler); break;
          case 5: _prog5(handler); break;
          case 6: _prog6(handler); break;
          case 7: _prog7(handler); break;
          case 8: _prog8(handler); break;
        }
        _timer.Start();
      };
    }

    public void Dispose() {
      if (_timer != null) {
        _timer.Dispose();
        _timer = null;
      }
    }

    public void Start(int programId) {
      Stop();
      _currentProgramId = programId;
      _preSetTimer = 0;
      if (_timer != null) {
        _timer.Start();
      }
    }

    public void Stop() {
      if (_timer != null) {
        _timer.Stop();
      }
    }

    private void _prog1(Action<IEnumerable<CylinderPosition>> handler) {
      //  Position 1
      const ushort STEPSZ = 2;
      CylinderPosition[] pos = new CylinderPosition[3];
      pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
      pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
      pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 127, Rtn = 127, StepSize = STEPSZ };
      handler(pos);
    }

    private void _prog2(Action<IEnumerable<CylinderPosition>> handler) {
      // Position 2
      const ushort STEPSZ = 2;
      CylinderPosition[] pos = new CylinderPosition[3];
      pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 207, Rtn = 207, StepSize = STEPSZ };
      pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 187, Rtn = 107, StepSize = STEPSZ };
      pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 127, Rtn = 127, StepSize = STEPSZ };
      handler(pos);
    }

    private void _prog3(Action<IEnumerable<CylinderPosition>> handler) {
      // Position 1 <-> 2

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 167, Rtn = 167, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 157, Rtn = 117, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000) {
        const ushort STEPSZ = 8;
        double targetUpper = 167 + 40 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetLoLng = 157 + 30 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetLoRtn = 117 - 10 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[2];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = (ushort)targetUpper, Rtn = (ushort)targetUpper, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = (ushort)targetLoLng, Rtn = (ushort)targetLoRtn, StepSize = STEPSZ };
        handler(pos);
      }

      if (_preSetTimer == 8960) {
        _preSetTimer = 3000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    private void _prog4(Action<IEnumerable<CylinderPosition>> handler) {
      // Free-breath Gating   

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000) {
        const ushort STEPSZ = 8;
        double target = 127 + 80 * Math.Sin((_preSetTimer - 3000) / 2500.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer == 7960) {
        _preSetTimer = 3000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    private void _prog5(Action<IEnumerable<CylinderPosition>> handler) {
      // Breath-hold Gating    
    
      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000 && _preSetTimer < 28000) {
        const ushort STEPSZ = 8;
        double target = 60 + 50 * Math.Sin((_preSetTimer - 3000) / 2500.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }     
      else if (_preSetTimer > 28000 && _preSetTimer < 38000) {
        const ushort STEPSZ = 4;
        double target = 200 + 50 * Math.Cos((_preSetTimer - 28000) / 40000.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer == 38000) {
        const ushort STEPSZ = 4;

        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer == 40000) {
        _preSetTimer = 6720;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    private void _prog6(Action<IEnumerable<CylinderPosition>> handler) {
      // Free-breath Gating, Position 1 <-> 2

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 167, Rtn = 167, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 157, Rtn = 117, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 64, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000) {
        const ushort STEPSZ = 8;
        double targetUpper = 167 + 40 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetLoLng = 157 + 30 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetLoRtn = 117 - 10 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetGaLng = 64 + 64 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetGaRtn = 127 + 4 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = (ushort)targetUpper, Rtn = (ushort)targetUpper, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = (ushort)targetLoLng, Rtn = (ushort)targetLoRtn, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)targetGaLng, Rtn = (ushort)targetGaRtn, StepSize = STEPSZ };
        handler(pos);
      }            
      if (_preSetTimer == 8960) {
        _preSetTimer = 3000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    private void _prog7(Action<IEnumerable<CylinderPosition>> handler) {
      // Free-breath Gating loosing signal

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000) {
        const ushort STEPSZ = 8;
        double target = 127 + 80 * Math.Sin((_preSetTimer - 3000) / 2500.0 * Math.PI);

        ushort rtnGP = 127;
        if (_preSetTimer >= 25000 && _preSetTimer < 35000) { rtnGP = 255; }

        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = rtnGP, StepSize = STEPSZ };
        handler(pos);
      }      
      if (_preSetTimer == 37960) {
        _preSetTimer = 3000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    private void _prog8(Action<IEnumerable<CylinderPosition>> handler) {
      // Free-breath Gating base line shift
      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = 130, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = 130, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 130, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000) {
        const ushort STEPSZ = 8;
        double baseline = 130 + 30 * Math.Sin((_preSetTimer - 3000) / 30000.0 * Math.PI);
        double target = baseline + 50 * Math.Sin((_preSetTimer - 3000) / 3000.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[3];
        pos[0] = new CylinderPosition() { Cy = Cylinder.Upper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.Lower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }          
      if (_preSetTimer == 62960) {
        _preSetTimer = 3000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }
   
  }
}
