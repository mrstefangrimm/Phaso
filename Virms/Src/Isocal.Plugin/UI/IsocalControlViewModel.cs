// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Isocal.UI {
  using System.ComponentModel;
  using System.Windows.Input;
  using Virms.Common.UI;

  public enum IsocalControlViewState {
    Manual,
    Manual_Minimized,
    Automatic,
    Automatic_Minimized
  }

  public class IsocalControlViewModel : IsocalViewModel, IPlugInControlViewModel {

    private IsocalControlViewState _viewState;

    static IsocalControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(IsocalControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public IsocalControlViewModel() {
      ControlViewState = IsocalControlViewState.Manual;
    }

    public IsocalControlViewState ControlViewState {
      get { return _viewState; }
      private set {
        if (_viewState != value) {
          _viewState = value;
          OnPropertyChanged();
          OnPropertyChanged("IsShown");
        }
      }
    }

    public bool IsShown => ControlViewState is IsocalControlViewState.Automatic or IsocalControlViewState.Manual;

    INotifyPropertyChanged IPlugInControlViewModel.GA => GA;

    public ICommand DoSetManual {
      get {
        return new RelayCommand<object>(param => {
          ControlViewState = IsocalControlViewState.Manual;
        });
      }
    }

    public ICommand DoSetAutomatic {
      get {
        return new RelayCommand<object>(param => {
          ControlViewState = IsocalControlViewState.Automatic;
        });
      }
    }

    public ICommand DoSetMinimized {
      get {
        return new RelayCommand<object>(param => {
          switch (ControlViewState) {
            default:
            case IsocalControlViewState.Manual_Minimized:
              ControlViewState = IsocalControlViewState.Manual;
              break;
            case IsocalControlViewState.Automatic_Minimized:
              ControlViewState = IsocalControlViewState.Automatic;
              break;
            case IsocalControlViewState.Manual:
              ControlViewState = IsocalControlViewState.Manual_Minimized;
              break;
            case IsocalControlViewState.Automatic:
              ControlViewState = IsocalControlViewState.Automatic_Minimized;
              break;
          }
        });
      }
    }

  }

}
