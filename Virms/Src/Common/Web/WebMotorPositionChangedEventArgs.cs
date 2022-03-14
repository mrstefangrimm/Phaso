// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;

  public class WebMotorPositionChangedEventArgs : EventArgs {
    public WebMotorPositionChangedEventArgs(byte channel, ushort position, ushort stepSize) {
      Position = new MophAppMotorPosition {
        Channel = channel,
        Value = position,
        StepSize = stepSize
      };
    }
    public MophAppMotorPosition Position { get; private set; }
  }
}
