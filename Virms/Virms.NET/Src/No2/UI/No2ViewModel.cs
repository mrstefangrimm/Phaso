/* No2ViewModel.cs - ViphApp (C) motion phantom application.
 * Copyright (C) 2020 by Stefan Grimm
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
using System.Runtime.CompilerServices;
using ViphApp.Common.UI;

namespace ViphApp.No2.UI {

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
