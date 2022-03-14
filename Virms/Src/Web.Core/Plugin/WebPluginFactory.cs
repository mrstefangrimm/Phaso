// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web.Core {
  using System;
  using System.Reflection;
  using Virms.Common;

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
