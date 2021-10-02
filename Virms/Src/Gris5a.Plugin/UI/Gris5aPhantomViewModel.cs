// Copyright (c) 2018-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Virms.Common.UI;

namespace Virms.Gris5a.UI {

  public class Gris5aPhantomViewModel : Gris5aViewModel, IPlugInPhantomViewModel {

    public Gris5aPhantomViewModel() {
      LU.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      LL.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      RU.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      RL.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      GA.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
    }
  }
}
