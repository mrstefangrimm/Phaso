// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;

namespace Virms.Common.UI {

  public class RotationPropertyChangedEventArgs : PropertyChangedEventArgs {
    public static readonly RotationPropertyChangedEventArgs RTNExt = new("RTNExt", true);
    public static readonly RotationPropertyChangedEventArgs RTNInt = new("RTNInt", false);

    public RotationPropertyChangedEventArgs(string propertyName, bool external)
      : base(propertyName) {
      External = external;
    }
    public bool External { get; private set; }
  }

  public class RotationViewModel : INotifyPropertyChanged {
    private int _rtn = 0;

    public int RTNInt {
      get { return _rtn; }
      set {
        _rtn = value;
        OnPropertyChanged(RotationPropertyChangedEventArgs.RTNInt);
        OnPropertyChanged(RotationPropertyChangedEventArgs.RTNExt);
      }
    }

    public double RTNExt {
      get { return _rtn + 180; }
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged(RotationPropertyChangedEventArgs args) {
      PropertyChanged?.Invoke(this, args);
    }
  }

}