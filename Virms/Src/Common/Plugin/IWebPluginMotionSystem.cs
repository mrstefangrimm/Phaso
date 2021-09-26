// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using ViphApp.Common.Com;
using Virms.Common.Web;

namespace ViphApp.Common.Plugin {

  public interface IWebPluginMotionSystem {

    event EventHandler<LogOutputEventArgs> LogOutput;

    string Name { get; }
    string Alias { get; }

    IEnumerable<WebMotionPattern> MotionPatterns { get; }
    IEnumerable<WebMotionAxis> MotionAxes { get; }

    void GoTo(MophAppMotorPosition[] positions);
  }
}
