// Copyright (c) 2018-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;

namespace Virms.Common.UI {

  public class CylinderPropertyChangedEventArgs : PropertyChangedEventArgs {
    public static readonly CylinderPropertyChangedEventArgs LNGExt = new CylinderPropertyChangedEventArgs("LNGExt", true);
    public static readonly CylinderPropertyChangedEventArgs LNGInt = new CylinderPropertyChangedEventArgs("LNGInt", false);
    public static readonly CylinderPropertyChangedEventArgs RTNExt = new CylinderPropertyChangedEventArgs("RTNExt", true);
    public static readonly CylinderPropertyChangedEventArgs RTNInt = new CylinderPropertyChangedEventArgs("RTNInt", false);


    public CylinderPropertyChangedEventArgs(string propertyName, bool external)
      : base(propertyName) {
      External = external;
    }
    public bool External { get; private set; }
  }

  public class CylinderViewModel : INotifyPropertyChanged {
    private int _lng = 127;
    private int _rtn = 127;

    public int LNGInt {
      get { return _lng; }
      set {
        _lng = value;
        OnPropertyChanged(CylinderPropertyChangedEventArgs.LNGInt);
        OnPropertyChanged(CylinderPropertyChangedEventArgs.LNGExt);
      }
    }

    public double LNGExt {
      get { return (_lng - 127) / 255.0 * 45; }
    }

    public int RTNInt {
      get { return _rtn; }
      set {
        _rtn = value;
        OnPropertyChanged(CylinderPropertyChangedEventArgs.RTNInt);
        OnPropertyChanged(CylinderPropertyChangedEventArgs.RTNExt);
      }
    }

    public double RTNExt {
      get { return (_rtn - 127) / 255.0 * 180; }
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged(CylinderPropertyChangedEventArgs args) {
      PropertyChanged?.Invoke(this, args);
    }
  }

}