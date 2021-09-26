/* AppSettingsViewModel.cs - ViphApp (C) motion phantom application.
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

using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using ViphApp.Common.Plugin;
using ViphApp.Common.UI;

namespace ViphApp.App.UI {

  public class AppSettingsViewModel : INotifyPropertyChanged {

    private MainViewModel _parent;
    private IPluginPhantom _selectedPhantom;

    public AppSettingsViewModel(MainViewModel parent, ObservableCollection<IPluginPhantom> availablePhantoms) {
      _parent = parent;
      AvailablePhantoms = availablePhantoms;
      _selectedPhantom = availablePhantoms[0];
    }

    public ObservableCollection<IPluginPhantom> AvailablePhantoms { get; private set; }

    public IPluginPhantom SelectedPhantom {
      get {
        return _selectedPhantom;
      }
      set {
        if (_selectedPhantom != value) {
          _selectedPhantom = value;
          _parent.Phantom = value.Phantom;
          _parent.Control = value.Control;
        }
      }
    }

    public ICommand DoShowSettingsDetails {
      get {
        return new RelayCommand<object>(param => {
          if (_parent.AppSettingsViewState == AppSettingsViewState.Minimized) {
            _parent.AppSettingsViewState = AppSettingsViewState.Details;
          }
          else {
            _parent.AppSettingsViewState = AppSettingsViewState.Minimized;
          }
        });
      }
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

  }
}
