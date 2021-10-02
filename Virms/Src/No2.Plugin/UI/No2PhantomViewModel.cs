// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Virms.Common.UI;

namespace Virms.No2.UI {

  public class No2PhantomViewModel : No2ViewModel, IPlugInPhantomViewModel {

    public No2PhantomViewModel() {
      L.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      R.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      GA.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
    }

  }
}
