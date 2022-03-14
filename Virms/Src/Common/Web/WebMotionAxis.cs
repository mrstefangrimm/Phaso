// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {

  public class WebMotionAxis {
    private readonly IMophAppProxy _proxy;
    public WebMotionAxis(int servoNumber, string alias, IMophAppProxy mophApp) {
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
