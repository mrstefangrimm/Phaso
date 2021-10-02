// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Linq;
using System.Reflection;
using Virms.Common.Plugin;

namespace Virms.App.Plugin {

  class PluginFactory {

    public IPluginBuilder CreatePluginBuilder(string pluginAsmName) {
      var asm = Assembly.LoadFile(pluginAsmName);
      var allTypes = asm.GetTypes();
      foreach (Type clType in allTypes) {
        var implIf = clType.GetInterfaces().Any(i => i == typeof(IPluginBuilder));
        if (implIf) {
          return Activator.CreateInstance(clType) as IPluginBuilder;
        }
      }
      return null;
    }
  }
}
