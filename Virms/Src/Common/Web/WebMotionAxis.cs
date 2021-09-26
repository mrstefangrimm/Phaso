// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

using ViphApp.Common.Com;

namespace Virms.Common.Web {

  public class WebMotionAxis {
    private readonly MophAppProxy _proxy;
    public WebMotionAxis(int servoNumber, string alias, MophAppProxy mophApp) {
      ServoNumber = servoNumber;
      Alias = alias;
      _proxy = mophApp;
    }
    public int ServoNumber { get; }
    public string Alias { get; }
    public int Position {
      get { return _proxy.LatestMotorPosition[ServoNumber]; }
    }
  }
}
