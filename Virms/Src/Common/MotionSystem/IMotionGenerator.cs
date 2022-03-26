// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;

  public interface IMotionGenerator {

    event EventHandler<MotionAxisChangedEventArgs> ServoPositionUpdated;

    void Start(int programId);
    void Stop();
  }
}
