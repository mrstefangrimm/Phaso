// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;
  using System.Collections.Generic;

  public interface IMotionSystem {

    event EventHandler<LogOutputEventArgs> LogOutput;

    string Name { get; }
    string Alias { get; }

    IEnumerable<MotionPattern> MotionPatterns { get; }
    IEnumerable<MotionAxis> MotionAxes { get; }

    void GoTo(MophAppMotorTarget[] positions);
  }
}
