/* MainViewModel.cs - ViphApp (C) motion phantom application.
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

using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using ViphApp.Common.Plugin;
using ViphApp.Common.UI;

namespace ViphApp.App.UI {

  public enum MainViewState {
    Normal,
    StatusViewMaximized,
    ControlViewMaximized
  }
    
  public enum ComStatusViewState {
    Details,
    Minimized,
    Maximized
  }

  public enum AppSettingsViewState {
    Details,
    Minimized
  }

  public class MainViewModel : INotifyPropertyChanged {

    private Common.Com.MophAppProxy _mophApp;
    private IPlugInPhantomViewModel _phantom;
    private IPlugInControlViewModel _control;
    private MainViewState _mainViewState;
    private ComStatusViewState _comStatusViewState;
    private AppSettingsViewState _appSettingsViewState;
      
    public MainViewModel(Common.Com.MophAppProxy mophApp, ObservableCollection<IPluginPhantom> availablePhantoms) {
      _mophApp = mophApp;
      Status = new ComStatusViewModel(this, _mophApp);
      Settings = new AppSettingsViewModel(this, availablePhantoms);

      Phantom = availablePhantoms[0].Phantom;
      Control = availablePhantoms[0].Control;

      MainViewState = MainViewState.Normal;
      ComStatusViewState = ComStatusViewState.Minimized;
      AppSettingsViewState = AppSettingsViewState.Minimized;
    } 

    public void OnClosing(object sender, EventArgs args) {
      if (_mophApp != null) {
        _mophApp.Disconnect();
      }
    }
        
    public MainViewState MainViewState {
      get { return _mainViewState; }
      set {
        if (_mainViewState != value) {
          _mainViewState = value;
          OnPropertyChanged();
        }
      }
    }

    public ComStatusViewState ComStatusViewState {
      get { return _comStatusViewState; }
      set {
        if (_comStatusViewState != value) {
          _comStatusViewState = value;
          OnPropertyChanged();
        }
      }
    }

    public AppSettingsViewState AppSettingsViewState {
      get { return _appSettingsViewState; }
      set {
        if (_appSettingsViewState != value) {
          _appSettingsViewState = value;
          OnPropertyChanged();
        }
      }
    }

    public ComStatusViewModel Status { get; private set; }   

    public AppSettingsViewModel Settings { get; private set; }

    public IPlugInPhantomViewModel Phantom {
      get { return _phantom; }
      set {
        if (_phantom != value) {
          _phantom = value;
          OnPropertyChanged();
        }
      }
    }

    public IPlugInControlViewModel Control {
      get { return _control; }
      set {
        if (_control != value) {
          if (_control != null) {
            _control.GA.PropertyChanged -= OnGatingDataChanged;
          }
          _control = value;
          _control.GA.PropertyChanged += OnGatingDataChanged;
          OnPropertyChanged();
        }
      }
    }

    private void OnGatingDataChanged(object sender, PropertyChangedEventArgs args) {
      OnPropertyChanged(args.PropertyName);
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}