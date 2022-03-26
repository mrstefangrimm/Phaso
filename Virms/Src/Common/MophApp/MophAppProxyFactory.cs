// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {

  public interface IMophAppProxyFactory {
    IMophAppProxy Create();
  }

  public class MophAppProxyFactory<T> : IMophAppProxyFactory where T: IMophAppProxy, new() {
    public IMophAppProxy Create() {
      return new T();
    }
  }
}
