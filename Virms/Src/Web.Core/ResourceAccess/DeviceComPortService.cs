// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.ResourceAccess {

  using System;
  using Virms.Common.Com;

  public class DeviceComPortService : IDisposable {

    public DeviceComPortService() {
      Proxy = new MophAppProxy();
    }

    public void Dispose() {
      Disconnect();
      Proxy.Dispose();
    }

    public MophAppProxy Proxy { get; }

    public void Connect(string comPort) {
      Proxy.Connect(comPort);
      // startstream, see https://github.com/mrstefangrimm/Phaso/wiki/API-Developer-Guide
      Proxy.SetCommandRegister(59);
    }
    
    public void Disconnect() {
      // stopstream, see https://github.com/mrstefangrimm/Phaso/wiki/API-Developer-Guide
      Proxy.SetCommandRegister(67);
      Proxy.Disconnect();
    }
  }
}
