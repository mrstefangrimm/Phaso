// Copyright (c) 2020-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Windows;

namespace Virms.Common.Plugin {
  public interface IPluginBuilder {
    IPluginPhantom BuildPluginPhantom(IMophAppProxy mophApp);
    DataTemplate BuildPhantomTemplate();
    DataTemplate BuildControlTemplate();
  }
}
