// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;

namespace Virms.Common.Web {
  public interface IWebMotionGenerator {

    event EventHandler<WebMotorPositionChangedEventArgs> ServoPositionChanged;

    void Start(int programId);
    void Stop();
  }
}
