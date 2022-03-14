// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using Virms.Common;

  public enum AppSericeResult {
    OK,
    NotFound,
    NotChanged
  }

  public class ApplicationApi {

    private readonly IRepository<MotionSystem> _motionSystemEntities;

    public ApplicationApi(IRepository<MotionSystem> entities) {
      _motionSystemEntities = entities;

      foreach (var entity in _motionSystemEntities.GetAll()) {
        if (!string.IsNullOrEmpty(entity.Data.ComPort)) {
          entity.Reconnect(entity.Data.ComPort);
        }
      }
    }

    public IEnumerable<MotionSystem> GetPhantoms() {
      return _motionSystemEntities.GetAll();
    }

    public MotionSystem GetMotionSystem(long id) {
      try {
        var motionSystem = _motionSystemEntities.Query(e => e.Id == id).SingleOrDefault();
        if (motionSystem == null) { return null; }

        return motionSystem;
      }
      catch (InvalidOperationException) {
        return null;
      }
    }

    public AppSericeResult PatchMotionSystem(long id, MotionSystemData data) {
      try {
        var motionSystem = _motionSystemEntities.Query(e => e.Id == id).SingleOrDefault();
        if (motionSystem == null) { return AppSericeResult.NotFound; }

        if (!string.IsNullOrEmpty(data.ComPort) && motionSystem.Data.ComPort != data.ComPort) {
          motionSystem.Reconnect(data.ComPort);
          // COM port cannot be set to null
          motionSystem.Data.ComPort = data.ComPort;
        }

        motionSystem.Data.InUse = data.InUse;
        motionSystem.Data.Timestamp = data.Timestamp;
        motionSystem.Data.ClientId = data.ClientId;

        _motionSystemEntities.Update(motionSystem);

        return AppSericeResult.OK;
      }
      catch (InvalidOperationException) {
        return AppSericeResult.NotChanged;
      }
    }

    public AppSericeResult PatchMotionSystem(long id, ServoPositionData[] data) {
      try {
        var motionSystem = _motionSystemEntities.Query(e => e.Id == id).SingleOrDefault();
        if (motionSystem == null) { return AppSericeResult.NotFound; }

        // TODO: if pattern not running...
        MophAppMotorPosition[] pos = new MophAppMotorPosition[data.Length];
        for (int n = 0; n < pos.Length; n++) {
          pos[n] = new MophAppMotorPosition {
            Channel = data[n].ServoNumber,
            Value = data[n].Position,
            StepSize = 10
          };
        }
        motionSystem.GoTo(pos);

        return AppSericeResult.OK;
      }
      catch (InvalidOperationException) {
        return AppSericeResult.NotChanged;
      }
    }

    public AppSericeResult PatchMotionSystemMotionPattern(long id, long pid, MotionPatternData data) {
      try {
        var motionSystem = _motionSystemEntities.Query(e => e.Id == id).SingleOrDefault();
        if (motionSystem == null) { return AppSericeResult.NotFound; }

        var pattern = motionSystem.MotionPatterns.Where(p => p.Id == pid).SingleOrDefault();
        if (pattern == null) { return AppSericeResult.NotFound; }

        if (data.Executing) {
          pattern.Start();
        }
        else {
          pattern.Stop();
        }

        return AppSericeResult.OK;
      }
      catch (InvalidOperationException) {
        return AppSericeResult.NotChanged;
      }
    }
  }
}
