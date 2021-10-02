// Copyright (c) 2018-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Virms.Common.UI;

namespace Virms.Gris5a.UI {

  public class Gris5aViewModel : INotifyPropertyChanged {

    private static CylinderViewModel _lu = new CylinderViewModel();
    private static CylinderViewModel _ru = new CylinderViewModel();
    private static CylinderViewModel _ll = new CylinderViewModel();
    private static CylinderViewModel _rl = new CylinderViewModel();
    private static CylinderViewModel _ga = new CylinderViewModel();

    public CylinderViewModel LU { get { return _lu; } }
    public CylinderViewModel RU { get { return _ru; } }
    public CylinderViewModel LL { get { return _ll; } }
    public CylinderViewModel RL { get { return _rl; } }
    public CylinderViewModel GA { get { return _ga; } }
    
    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}
