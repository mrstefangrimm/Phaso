// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Virms.Common.UI;

namespace Virms.No3.UI {

  public class No3ViewModel : INotifyPropertyChanged {

    private static CylinderViewModel _upper = new CylinderViewModel();
    private static CylinderViewModel _lower = new CylinderViewModel();
    private static CylinderViewModel _gating = new CylinderViewModel();

    public CylinderViewModel UP { get { return _upper; } }
    public CylinderViewModel LO { get { return _lower; } }
    public CylinderViewModel GA { get { return _gating; } }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}
