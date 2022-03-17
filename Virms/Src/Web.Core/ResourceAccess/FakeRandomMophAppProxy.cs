// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {
  using System;
  using Virms.Common;

  public class FakeRandomMophAppProxy : IMophAppProxy {

    private Random _randomGenerator = new Random();

    public event EventHandler<LogOutputEventArgs> LogOutput;

    public byte[] LatestMotorPosition {
      get {
        var data = new byte[16];
        _randomGenerator.NextBytes(data);
        return data;
      }
    }

    public bool Connect(string comPort) {

      LogOutput?.Invoke(this, new LogOutputEventArgs { Text = "Synced" });
      return true;
    }

    public void Disconnect() {
    }

    public void GoTo(MophAppMotorPosition[] positions) {
    }

    public void SetCommandRegister(byte cmd) {
    }
  }
}
