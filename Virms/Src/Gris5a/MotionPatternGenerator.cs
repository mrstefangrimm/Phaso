// Copyright (c) 2018-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Gris5a {
  using System;
  using System.Collections.Generic;
  using System.Timers;
  using Virms.Common;

  public enum Cylinder { LeftUpper, LeftLower, RightUpper, RightLower, Platform }

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

    // Marker Position 1
    private void _prog1(Action<IEnumerable<CylinderPosition>> handler) {

      const ushort STEPSZ = 2;

      if (_preSetTimer == 0) {
        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 100, Rtn = 100, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 100, Rtn = 100, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 100, Rtn = 100, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 100, Rtn = 100, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 0, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer == 3000) {
        CylinderPosition[] pos = new CylinderPosition[4];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer <= 3000) {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    // Marker Position 2
    private void _prog2(Action<IEnumerable<CylinderPosition>> handler) {

      const ushort STEPSZ = 2;

      if (_preSetTimer == 0) {
        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 100, Rtn = 100, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 100, Rtn = 100, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 100, Rtn = 100, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 70, Rtn = 70, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 0, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer == 3000) {
        CylinderPosition[] pos = new CylinderPosition[4];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 87, Rtn = 167, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 117, Rtn = 117, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 87, Rtn = 137, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 137, Rtn = 87, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer <= 3000) {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    // Marker Position 1 <-> 2
    private void _prog3(Action<IEnumerable<CylinderPosition>> handler) {

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 0, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000) {
        const ushort STEPSZ = 4;
        double targetDeltaSmall = 15 * MathEx.Sin4((_preSetTimer - 3000) / 3000d * Math.PI);
        double targetDeltaLarge = 40 * MathEx.Sin4((_preSetTimer - 3000) / 3000d * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[4];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = (ushort)(127 - targetDeltaLarge), Rtn = (ushort)(127 + targetDeltaLarge), StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = (ushort)(127 - targetDeltaSmall), Rtn = (ushort)(127 - targetDeltaSmall), StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = (ushort)(127 - targetDeltaLarge), Rtn = (ushort)(127 + targetDeltaSmall), StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = (ushort)(127 + targetDeltaSmall), Rtn = (ushort)(127 - targetDeltaLarge), StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer == 8960) {
        _preSetTimer = 3000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    // Free-breath Gating
    private void _prog4(Action<IEnumerable<CylinderPosition>> handler) {

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 2960) {
        const ushort STEPSZ = 4;
        double target = 47 + 160 * MathEx.Sin4((_preSetTimer - 2960) / 2480.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer == 7840) {
        _preSetTimer = 2960;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    // Breath-hold Gating
    private void _prog5(Action<IEnumerable<CylinderPosition>> handler) {

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000 && _preSetTimer < 28000) {
        const ushort STEPSZ = 4;
        double target = 10 + 100 * MathEx.Sin4((_preSetTimer - 3000) / 3000d * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer > 28000 && _preSetTimer < 38000) {
        const ushort STEPSZ = 4;
        double target = 200 + 50 * Math.Cos((_preSetTimer - 28000) / 30000d * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer == 38000) {
        const ushort STEPSZ = 4;

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 10, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer == 40000) {
        _preSetTimer = 15000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    // Free-breath Gating, Marker Position 1 <-> 2
    private void _prog6(Action<IEnumerable<CylinderPosition>> handler) {

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 127, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 2960) {

        const ushort STEPSZ = 4;
        double targetDeltaSmall = 15 * MathEx.Sin4((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetDeltaLarge = 40 * MathEx.Sin4((_preSetTimer - 3000) / 3000.0 * Math.PI);
        double targetGating = 47 + 160 * MathEx.Sin4((_preSetTimer - 2960) / 2480.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = (ushort)(127 - targetDeltaLarge), Rtn = (ushort)(127 + targetDeltaLarge), StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = (ushort)(127 - targetDeltaSmall), Rtn = (ushort)(127 - targetDeltaSmall), StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = (ushort)(127 - targetDeltaLarge), Rtn = (ushort)(127 + targetDeltaSmall), StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = (ushort)(127 + targetDeltaSmall), Rtn = (ushort)(127 - targetDeltaLarge), StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)targetGating, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer == 7840) {
        _preSetTimer = 2960;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }

    }

    // Free-breath Gating loosing signal
    private void _prog7(Action<IEnumerable<CylinderPosition>> handler) {

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;
        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 47, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 2960) {
        const ushort STEPSZ = 4;
        double target = 47 + 160 * MathEx.Sin4((_preSetTimer - 2960) / 2480.0 * Math.PI);

        ushort rtnMP = 127;
        if (_preSetTimer >= 25000 && _preSetTimer < 35000) { rtnMP = 255; }

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = (ushort)(target), Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)(target), Rtn = rtnMP, StepSize = STEPSZ };
        handler(pos);
      }
      if (_preSetTimer == 37960) {
        _preSetTimer = 3000;
      }
      else {
        _preSetTimer += PRESETTIMERINCR;
      }
    }

    // Free-breath Gating base line shift
    private void _prog8(Action<IEnumerable<CylinderPosition>> handler) {

      if (_preSetTimer == 0) {
        const ushort STEPSZ = 2;

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = 60, Rtn = 127, StepSize = STEPSZ };
        handler(pos);
      }
      else if (_preSetTimer >= 3000) {
        const ushort STEPSZ = 4;
        double baseline = 60 + 20 * Math.Sin((_preSetTimer - 3000) / 30000.0 * Math.PI);
        double target = baseline + 100 * MathEx.Sin4((_preSetTimer - 3000) / 3000.0 * Math.PI);

        CylinderPosition[] pos = new CylinderPosition[5];
        pos[0] = new CylinderPosition() { Cy = Cylinder.LeftUpper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[1] = new CylinderPosition() { Cy = Cylinder.RightUpper, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[2] = new CylinderPosition() { Cy = Cylinder.LeftLower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[3] = new CylinderPosition() { Cy = Cylinder.RightLower, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
        pos[4] = new CylinderPosition() { Cy = Cylinder.Platform, Lng = (ushort)target, Rtn = 127, StepSize = STEPSZ };
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
