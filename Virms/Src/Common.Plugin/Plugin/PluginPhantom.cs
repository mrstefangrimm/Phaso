// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Virms.Common.UI;

namespace Virms.Common.Plugin {

  public class PluginPhantom : IPluginPhantom {
    
    public PluginPhantom(string name, IPlugInPhantomViewModel phantom, IPlugInControlViewModel control) {
      Name = name;
      Phantom = phantom;
      Control = control;
    }

    public string Name { get; private set; }

    public IPlugInPhantomViewModel Phantom { get; private set; }

    public IPlugInControlViewModel Control { get; private set; }
  }
}
