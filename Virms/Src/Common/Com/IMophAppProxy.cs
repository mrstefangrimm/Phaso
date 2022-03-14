// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;

  public interface IMophAppProxy {
    event EventHandler<LogOutputEventArgs> LogOutput;

    byte[] LatestMotorPosition { get; }

    bool Connect(string comPort);
    void Disconnect();
    void GoTo(MophAppMotorPosition[] positions);
    void SetCommandRegister(byte cmd);
  }
}
