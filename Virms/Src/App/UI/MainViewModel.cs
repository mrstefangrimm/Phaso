// Copyright (c) 2018-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Virms.Common.Plugin;
using Virms.Common.UI;

namespace Virms.App.UI {

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