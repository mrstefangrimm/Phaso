// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Virms.Common.UI;

namespace Virms.No2.UI {

  public class No2ViewModel : INotifyPropertyChanged {

    private static CylinderViewModel _left = new CylinderViewModel();
    private static CylinderViewModel _right = new CylinderViewModel();
    private static CylinderViewModel _gating = new CylinderViewModel();

    public CylinderViewModel L { get { return _left; } }
    public CylinderViewModel R { get { return _right; } }
    public CylinderViewModel GA { get { return _gating; } }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}
