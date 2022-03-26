// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;

  public class MotionPattern {
    private readonly IMophAppProxy _proxy;
    private IMotionGenerator _motionGenerator;

    public MotionPattern(string name, int programId, IMophAppProxy mophApp, IMotionGenerator motionGenerator) {
      Name = name;
      ProgramId = programId;
      _proxy = mophApp;
      _motionGenerator = motionGenerator;

      _motionGenerator.ServoPositionUpdated += OnServoPositionUpdated;
    }

    public event EventHandler<MotionAxisChangedEventArgs> ServoPositionChanged;

    public string Name { get; }
    public int ProgramId { get; }

    public void Start() {
      _motionGenerator.Start(ProgramId);
    }

    public void Stop() {
      _motionGenerator.Stop();
    }

    private void OnServoPositionUpdated(object sender, MotionAxisChangedEventArgs args) {
      _proxy.GoTo(args.Targets);
      ServoPositionChanged?.Invoke(this, args);
    }
  }
}
