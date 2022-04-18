// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  using System;
  using System.Reflection;

  public class InstanceFactory {

    public T Create<T>(string assemblyPath) {
      var ass = Assembly.LoadFile(assemblyPath);

      var expTypes = ass.ExportedTypes;
      foreach (Type clType in expTypes) {
        if (typeof(T).IsAssignableFrom(clType)) {
          return (T)ass.CreateInstance(clType.FullName);
        }        
      }

      throw new NotImplementedException();
    }

  }
}
