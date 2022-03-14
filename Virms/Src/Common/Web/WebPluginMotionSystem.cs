// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;
  using System.Collections.Generic;

  public class  WebPluginMotionSystem : IWebPluginMotionSystem { 

    private readonly IMophAppProxy _proxy;

    public event EventHandler<LogOutputEventArgs> LogOutput;

    public WebPluginMotionSystem(string name, string alias,
                                 IMophAppProxy mophApp, 
                                 IEnumerable<WebMotionPattern> motionPatterns,
                                 IEnumerable<WebMotionAxis> axes) {
      Name = name;
      Alias = alias;
      _proxy = mophApp;
      MotionPatterns = motionPatterns;
      MotionAxes = axes;

      _proxy.LogOutput += OnLogOutput;
    }

    public string Name { get; }
    public string Alias { get; }
    public IEnumerable<WebMotionPattern> MotionPatterns { get; }
    public IEnumerable<WebMotionAxis> MotionAxes { get; }

    
    public void GoTo(MophAppMotorPosition[] positions) {
      _proxy.GoTo(positions);
    }

    private void OnLogOutput(object sender, LogOutputEventArgs args) {
      LogOutput?.Invoke(this, args);
    }
  }
}
