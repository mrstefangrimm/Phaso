// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {
  using Virms.Common;

  public class MotionPattern : Entity<MotionPatternData> {

    private readonly WebMotionPattern _plugin;

    public MotionPattern(WebMotionPattern plugin) {
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
