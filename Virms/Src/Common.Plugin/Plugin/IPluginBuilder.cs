// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Windows;
using Virms.Common.Com;

namespace Virms.Common.Plugin {
  public interface IPluginBuilder {
    IPluginPhantom BuildPluginPhantom(MophAppProxy mophApp);
    DataTemplate BuildPhantomTemplate();
    DataTemplate BuildControlTemplate();
  }
}
