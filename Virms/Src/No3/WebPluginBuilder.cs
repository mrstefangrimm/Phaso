// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using Virms.Common;
using Virms.No3;

public class WebPluginBuilder : IWebPluginBuilder {

  public IWebPluginMotionSystem BuildPluginWebMotionSystem(IMophAppProxy mophApp) {

    var generator = new LungGeneratorHook();
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

    var phantom = new WebPluginMotionSystem("Lung Phantom", "No3", mophApp, patterns, axes);
    return phantom;
  }
}

internal class LungGeneratorHook : IWebMotionGenerator, IDisposable {
  private readonly MotionPatternGenerator _generator;

  public event EventHandler<WebMotorPositionChangedEventArgs> ServoPositionChanged;

  public LungGeneratorHook() {
    _generator = new MotionPatternGenerator(OnPositionChanged);
  }

  public void Dispose() { _generator.Dispose(); }
  public void Start(int programId) { _generator.Start(programId); }
  public void Stop() { _generator.Stop(); }

  private void OnPositionChanged(IEnumerable<CylinderPosition> positions) {
    foreach (var pos in positions) {
      switch (pos.Cy) {
        default: break;
        case Cylinder.Upper:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.UPLNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.UPRTN, pos.Rtn, pos.StepSize));
          break;
        case Cylinder.Lower:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.LOLNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.LORTN, pos.Rtn, pos.StepSize));
          break;
        case Cylinder.Platform:
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.GALNG, pos.Lng, pos.StepSize));
          ServoPositionChanged?.Invoke(this, new WebMotorPositionChangedEventArgs((byte)ServoNumber.GARTN, pos.Rtn, pos.StepSize));
          break;
      }
    }
  }

}

