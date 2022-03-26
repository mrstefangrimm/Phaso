// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;
  using System.Collections.Generic;

  public class  MotionSystem : IMotionSystem { 

    private readonly IMophAppProxy _proxy;

    public event EventHandler<LogOutputEventArgs> LogOutput;

    public MotionSystem(string name, string alias,
                                 IMophAppProxy mophApp, 
                                 IEnumerable<MotionPattern> motionPatterns,
                                 IEnumerable<MotionAxis> axes) {
      Name = name;
      Alias = alias;
      _proxy = mophApp;
      MotionPatterns = motionPatterns;
      MotionAxes = axes;

      _proxy.LogOutput += OnLogOutput;
    }

    public string Name { get; }
    public string Alias { get; }
    public IEnumerable<MotionPattern> MotionPatterns { get; }
    public IEnumerable<MotionAxis> MotionAxes { get; }

    
    public void GoTo(MophAppMotorTarget[] positions) {
      if (_proxy.State == SyncState.Synced) {
        _proxy.GoTo(positions);
      }
    }

    private void OnLogOutput(object sender, LogOutputEventArgs args) {
      LogOutput?.Invoke(this, args);
    }
  }
}
