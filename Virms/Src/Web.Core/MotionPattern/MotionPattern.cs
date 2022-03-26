// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {
  public class MotionPattern : Entity<MotionPatternData> {

    private readonly Common.MotionPattern _plugin;

    public MotionPattern(Common.MotionPattern plugin) {
      _plugin = plugin;
    }

    public void Start() {
      _plugin.Start();
    }

    public void Stop() {
      _plugin.Stop();
    }
  }  
}
