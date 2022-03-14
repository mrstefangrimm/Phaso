﻿// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {
  using System.Linq;
  using Virms.Common;
  using Virms.Web.ResourceAccess;


  public class MotionSystemBuilder {

    public MotionSystem Create(IWebPluginBuilder pluginBuilder, IIdCreator idCreator, DeviceComPortService deviceService) {

      var pluginMotionSystem = pluginBuilder.BuildPluginWebMotionSystem(deviceService.Proxy);

      var entityMotionSystem = new MotionSystem(pluginMotionSystem, deviceService);
      entityMotionSystem.Id = idCreator.CreateId();
      entityMotionSystem.Data.Name = pluginMotionSystem.Name;
      entityMotionSystem.Data.Alias = pluginMotionSystem.Alias;
      entityMotionSystem.Data.ComPort = string.Empty;
      entityMotionSystem.Data.InUse = false;
      entityMotionSystem.Data.Synced = false;

      foreach (var pluginMotionPattern in pluginMotionSystem.MotionPatterns) {
        var motionPattern = new MotionPattern(pluginMotionPattern);
        entityMotionSystem.MotionPatterns.Add(motionPattern);
        motionPattern.Id = idCreator.CreateId();
        motionPattern.Data.ProgId = pluginMotionPattern.ProgramId;
        motionPattern.Data.Name = pluginMotionPattern.Name;
        motionPattern.Data.Executing = false;
      }

      entityMotionSystem.Data.ServoCount = pluginMotionSystem.MotionAxes.Count();
      foreach (var pluginMotionAxis in pluginMotionSystem.MotionAxes) {
        entityMotionSystem.Data.Axes.Add(pluginMotionAxis);
      }

      return entityMotionSystem;
    }
  }
}
