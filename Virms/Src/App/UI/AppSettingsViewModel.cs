// Copyright (c) 2018-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using Virms.Common.Plugin;
using Virms.Common.UI;

namespace Virms.App.UI {

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
