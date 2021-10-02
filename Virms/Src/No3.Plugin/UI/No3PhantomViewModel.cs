// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Virms.Common.UI;

namespace Virms.No3.UI {

  public class No3PhantomViewModel : No3ViewModel, IPlugInPhantomViewModel {

    public No3PhantomViewModel() {
      UP.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      LO.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      GA.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
    }

  }
}
