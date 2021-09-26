// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Reflection;
using ViphApp.Common.Plugin;

namespace Virms.Web.Core {

  public class WebPluginFactory {

    public IWebPluginBuilder CreatePluginBuilder(string pluginAsmName) {
      var asm = Assembly.LoadFile(pluginAsmName);

      var clType = asm.GetType("WebPluginBuilder", false, true);
      var implIf = clType != null && typeof(IWebPluginBuilder).IsAssignableFrom(clType);
      if (implIf) {
        return Activator.CreateInstance(clType) as IWebPluginBuilder;
      }
      return null;    
    }
  }
}
