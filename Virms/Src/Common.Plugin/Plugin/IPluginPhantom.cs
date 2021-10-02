// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Virms.Common.UI;

namespace Virms.Common.Plugin {

  public interface IPluginPhantom {
    string Name { get; }
    IPlugInPhantomViewModel Phantom { get; }
    IPlugInControlViewModel Control { get; }
  }
}
