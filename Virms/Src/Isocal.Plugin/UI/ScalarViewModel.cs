// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;

namespace Virms.Common.UI {

  public class ScalarPropertyChangedEventArgs : PropertyChangedEventArgs {
    public static readonly ScalarPropertyChangedEventArgs LNGExt = new("LNGExt", true);
    public static readonly ScalarPropertyChangedEventArgs LNGInt = new("LNGInt", false);

    public ScalarPropertyChangedEventArgs(string propertyName, bool external)
      : base(propertyName) {
      External = external;
    }
    public bool External { get; private set; }
  }

  public class ScalarViewModel : INotifyPropertyChanged {
    private readonly bool _negate;
    private int _lng = 0;

    public ScalarViewModel(bool negate, int lng) {
      _negate = negate;
      _lng = lng;
    }

    public int LNGInt {
      get { return _lng; }
      set {
        _lng = value;
        OnPropertyChanged(ScalarPropertyChangedEventArgs.LNGInt);
        OnPropertyChanged(ScalarPropertyChangedEventArgs.LNGExt);
      }
    }

    public double LNGExt {
      get { return _lng * 2.8; }
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged(ScalarPropertyChangedEventArgs args) {
      PropertyChanged?.Invoke(this, args);
    }
  }

}