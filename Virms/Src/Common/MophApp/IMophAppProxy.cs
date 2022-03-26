// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;

  public enum SyncState { Desynced, Synced }

  public interface IMophAppProxy {
    event EventHandler<LogOutputEventArgs> LogOutput;

    SyncState State { get; }
    byte[] LatestMotorPosition { get; }

    bool Connect(string comPort);
    void Disconnect();
    void GoTo(MophAppMotorTarget[] positions);
    void SetCommandRegister(byte cmd);
  }
}
