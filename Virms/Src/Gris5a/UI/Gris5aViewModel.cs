/* Gris5aViewModel.cs - ViphApp (C) motion phantom application.
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

namespace ViphApp.Gris5a.UI {

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
