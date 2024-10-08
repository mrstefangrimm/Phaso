﻿// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

using System;
using System.Collections.Generic;
using Virms.Common;

namespace Virms.Web.Core {
  public class MotionSystemData {
    public string Name { get; set; }
    public string Alias { get; set; }
    public bool InUse { get; set; }
    public string ClientId { get; set; }
    public DateTime Timestamp { get; set; }
    public bool Synced { get; set; }
    public string ComPort { get; set; }
    public int ServoCount { get; set; }
    public IList<MotionAxis> Axes { get; } = new List<MotionAxis>();
    public IList<ServoPositionData> Positions { get; } = new List<ServoPositionData>();
  }
}
