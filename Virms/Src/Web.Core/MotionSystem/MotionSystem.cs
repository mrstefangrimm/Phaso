// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {

  using System.Collections.Generic;
  using Virms.Common;
  using Virms.Web.ResourceAccess;

  public class MotionSystem : Entity<MotionSystemData> {

    private readonly IWebPluginMotionSystem _plugin;
    private readonly DeviceComPortService _deviceService;

    public MotionSystem(IWebPluginMotionSystem plugin, DeviceComPortService deviceService) {
      _plugin = plugin;
      _deviceService = deviceService;
      _plugin.LogOutput += OnLogOutput;
    }

    public IList<MotionPattern> MotionPatterns { get; } = new List<MotionPattern>();

    public void Reconnect(string comPort) {
      Data.InUse = false;
      Data.Synced = false;
      Data.ComPort = comPort;
      _deviceService.Disconnect();
      _deviceService.Connect(comPort);
    }

    public void GoTo(MophAppMotorPosition[] data) {
      _plugin.GoTo(data);
    }

    private void OnLogOutput(object sender, LogOutputEventArgs args) {
      if (!Data.Synced) {
        Data.Synced = args.Text == "Synced";
      }
    }

  }
}
