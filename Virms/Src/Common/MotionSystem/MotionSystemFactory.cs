// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;
  using System.Reflection;

  public class MotionSystemFactory {

    public IMotionSystemBuilder CreatePluginBuilder(string pluginAsmName) {
      var asm = Assembly.LoadFile(pluginAsmName);

      var clType = asm.GetType("MotionSystemBuilder", false, true);
      var implIf = clType != null && typeof(IMotionSystemBuilder).IsAssignableFrom(clType);
      if (implIf) {
        return Activator.CreateInstance(clType) as IMotionSystemBuilder;
      }
      return null;    
    }
  }
}
