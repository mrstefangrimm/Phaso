// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using Virms.Common.Com;
using Virms.Common.Plugin;
using Virms.Common.Web;
using Virms.Gris5a;

public class WebPluginBuilder : IWebPluginBuilder {

  public IWebPluginMotionSystem BuildPluginWebMotionSystem(MophAppProxy mophApp) {

    var generator = new MarkerGeneratorHook();
    List<WebMotionPattern> patterns = new List<WebMotionPattern>();
    var prog1 = new WebMotionPattern("Pos 1", 1, mophApp, generator);
    patterns.Add(prog1);
    var prog2 = new WebMotionPattern("Pos 2", 2, mophApp, generator);
    patterns.Add(prog2);
    var prog3 = new WebMotionPattern("Pos 1 - Pos 2", 3, mophApp, generator);
    patterns.Add(prog3);
    var prog4 = new WebMotionPattern("Free-breath Gating", 4, mophApp, generator);
    patterns.Add(prog4);
    var prog5 = new WebMotionPattern("Breath-hold Gating", 5, mophApp, generator);
    patterns.Add(prog5);
    var prog6 = new WebMotionPattern("Free-breath Gating, Pos 1 - 2", 6, mophApp, generator);
    patterns.Add(prog6);
    var prog7 = new WebMotionPattern("Free-breath Gating loosing signal", 7, mophApp, generator);
    patterns.Add(prog7);
    var prog8 = new WebMotionPattern("Free-breath Gating base line shift", 8, mophApp, generator);
    patterns.Add(prog8);

    List<WebMotionAxis> axes = new List<WebMotionAxis>();
    foreach (var servo in Enum.GetValues(typeof(ServoNumber))) {
      var axis = new WebMotionAxis((byte)servo, servo.ToString(), mophApp);
      axes.Add(axis);
    }

    var phantom = new WebPluginMotionSystem("Marker Phantom", "GRIS5A", mophApp, patterns, axes);
    return phantom;
  }
}

internal class MarkerGeneratorHook : IWebMotionGenerator, IDisposable {
  private readonly MotionPatternGenerator _generator;

  public event EventHandler<WebMotorPositionChangedEventArgs> ServoPositionChanged;

  public MarkerGeneratorHook() {
    _generator = new MotionPatternGenerator(OnPositionChanged);
  }

  public void Dispose() { _generator.Dispose(); }
  public void Start(int programId) {
    _generator.Start(programId);
  }
  public void Stop() { _generator.Stop(); }

  private void OnPositionChanged(IEnumerable<CylinderPosition> positions) {

    foreach (var pos in positions) {
      switch (pos.Cy) {
        default: break;
        case Cylinder.LeftUpper:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.LULNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.LURTN, pos.Rtn, pos.StepSize));
          break;
        case Cylinder.LeftLower:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.LLLNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.LLRTN, pos.Rtn, pos.StepSize));
          break;
        case Cylinder.RightUpper:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.RULNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.RURTN, pos.Rtn, pos.StepSize));
          break;
        case Cylinder.RightLower:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.RLLNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.RLRTN, pos.Rtn, pos.StepSize));
          break;
        case Cylinder.Platform:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.GALNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.GARTN, pos.Rtn, pos.StepSize));
          break;
      }
    }

  }
}
