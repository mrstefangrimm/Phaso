// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {
  using System;
  using Virms.Common;

  public class FakeEchoMophAppProxy : IMophAppProxy {

    public event EventHandler<LogOutputEventArgs> LogOutput;

    public byte[] LatestMotorPosition { get; private set; } = { 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127 };

    public bool Connect(string comPort) {

      LogOutput?.Invoke(this, new LogOutputEventArgs { Text = "Synced" });
      return true;
    }

    public void Disconnect() {
    }

    public void GoTo(MophAppMotorPosition[] positions) {
      for (int n=0;n< positions.Length; n++) {
        LatestMotorPosition[positions[n].Channel] = (byte)positions[n].Value;
      }
    }

    public void SetCommandRegister(byte cmd) {
    }
  }
}
