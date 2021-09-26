/* CylinderViewModel.cs - ViphApp (C) motion phantom application.
 * Copyright (C) 2018-2020 by Stefan Grimm
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with the ViphApp software.  If not, see
 * <http://www.gnu.org/licenses/>.
 */

using System.ComponentModel;

namespace ViphApp.Common.UI {

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