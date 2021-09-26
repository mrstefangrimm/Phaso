﻿// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using ViphApp.Common.Com;

namespace ViphApp.Common.Plugin {
  public interface IWebPluginBuilder {
    IWebPluginMotionSystem BuildPluginWebMotionSystem(MophAppProxy mophApp);
  }
}
