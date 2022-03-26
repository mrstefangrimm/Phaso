// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using Virms.Common;
using Virms.Gris5a;

public class MotionSystemBuilder : IMotionSystemBuilder {

  public IMotionSystem BuildMotionSystem(IMophAppProxy mophApp) {

    var generator = new MarkerGeneratorHook();
    List<MotionPattern> patterns = new List<MotionPattern>();
    var prog1 = new MotionPattern("Pos 1", 1, mophApp, generator);
    patterns.Add(prog1);
    var prog2 = new MotionPattern("Pos 2", 2, mophApp, generator);
    patterns.Add(prog2);
    var prog3 = new MotionPattern("Pos 1 - Pos 2", 3, mophApp, generator);
    patterns.Add(prog3);
    var prog4 = new MotionPattern("Free-breath Gating", 4, mophApp, generator);
    patterns.Add(prog4);
    var prog5 = new MotionPattern("Breath-hold Gating", 5, mophApp, generator);
    patterns.Add(prog5);
    var prog6 = new MotionPattern("Free-breath Gating, Pos 1 - 2", 6, mophApp, generator);
    patterns.Add(prog6);
    var prog7 = new MotionPattern("Free-breath Gating loosing signal", 7, mophApp, generator);
    patterns.Add(prog7);
    var prog8 = new MotionPattern("Free-breath Gating base line shift", 8, mophApp, generator);
    patterns.Add(prog8);

    List<MotionAxis> axes = new List<MotionAxis>();
    foreach (var servo in Enum.GetValues(typeof(ServoNumber))) {
      var axis = new MotionAxis((byte)servo, servo.ToString(), mophApp);
      axes.Add(axis);
    }

    var phantom = new MotionSystem("Marker Phantom", "GRIS5A", mophApp, patterns, axes);
    return phantom;
  }
}

internal class MarkerGeneratorHook : IMotionGenerator, IDisposable {
  private readonly MotionPatternGenerator _generator;

  public event EventHandler<MotionAxisChangedEventArgs> ServoPositionUpdated;

  public MarkerGeneratorHook() {
    _generator = new MotionPatternGenerator(OnPositionUpdated);
  }

  public void Dispose() { _generator.Dispose(); }
  public void Start(int programId) {
    _generator.Start(programId);
  }
  public void Stop() { _generator.Stop(); }

  private void OnPositionUpdated(IEnumerable<CylinderPosition> positions) {

    List<MophAppMotorTarget> targets = new();
    foreach (var pos in positions) {
      switch (pos.Cy) {
        default: break;
        case Cylinder.LeftUpper:
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.LULNG, Value = pos.Lng, StepSize = pos.StepSize });
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.LURTN, Value = pos.Rtn, StepSize = pos.StepSize });
          break;
        case Cylinder.LeftLower:
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.LLLNG, Value = pos.Lng, StepSize = pos.StepSize });
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.LLRTN, Value = pos.Rtn, StepSize = pos.StepSize });
          break;
        case Cylinder.RightUpper:
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.RULNG, Value = pos.Lng, StepSize = pos.StepSize });
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.RURTN, Value = pos.Rtn, StepSize = pos.StepSize });
          break;
        case Cylinder.RightLower:
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.RLLNG, Value = pos.Lng, StepSize = pos.StepSize });
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.RLRTN, Value = pos.Rtn, StepSize = pos.StepSize });
          break;
        case Cylinder.Platform:
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.GALNG, Value = pos.Lng, StepSize = pos.StepSize });
          targets.Add(new MophAppMotorTarget { Channel = (byte)ServoNumber.GARTN, Value = pos.Rtn, StepSize = pos.StepSize });
          break;
      }
    }
    ServoPositionUpdated?.Invoke(this, new MotionAxisChangedEventArgs(targets.ToArray()));
  }
}
