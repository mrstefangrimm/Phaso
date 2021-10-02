// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Virms.Common.Com;

namespace Virms.Common.Plugin {
  public interface IWebPluginBuilder {
    IWebPluginMotionSystem BuildPluginWebMotionSystem(MophAppProxy mophApp);
  }
}
