// Copyright (c) 2020-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using Virms.Common;
using Virms.Common.UI;

namespace Virms.No3.UI {

  public enum No3ControlViewState {
    Manual,
    Manual_Minimized,
    Automatic,
    Automatic_Minimized
  }

  public class No3ControlViewModel : No3ViewModel, IPlugInControlViewModel {

    private MophAppProxy _mophApp;
    private No3ControlViewState _viewState;
    private bool _isRunning;
    private string _selectedProgram;
    private MotionPatternGenerator _patternGenerator;

    static No3ControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(No3ControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public No3ControlViewModel(IMophAppProxy mophApp) {
      _mophApp = mophApp as MophAppProxy;
      ControlViewState = No3ControlViewState.Manual;

      Programs.Add("Program 1");
      Programs.Add("Program 2");
      Programs.Add("Program 3");
      Programs.Add("Program 4");
      Programs.Add("Program 5");
      Programs.Add("Program 6");
      Programs.Add("Program 7");
      Programs.Add("Program 8");
      SelectedProgram = "Program 1";

      UP.PropertyChanged += UP_PropertyChanged;
      LO.PropertyChanged += LO_PropertyChanged;
      GA.PropertyChanged += GA_PropertyChanged;

      UP.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      LO.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      GA.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);

      _patternGenerator = new MotionPatternGenerator(OnCylinderPositionsChanged);
    }

    public No3ControlViewState ControlViewState {
      get { return _viewState; }
      private set {
        if (_viewState != value) {
          _viewState = value;
          OnPropertyChanged();
          OnPropertyChanged("IsShown");
        }
      }
    }

    public ICommand DoSetManual {
      get {
        return new RelayCommand<object>(param => {
          ControlViewState = No3ControlViewState.Manual;
        });
      }
    }

    public ICommand DoSetAutomatic {
      get {
        return new RelayCommand<object>(param => {
          ControlViewState = No3ControlViewState.Automatic;
        });
      }
    }

    public ICommand DoSetMinimized {
      get {
        return new RelayCommand<object>(param => {
          switch (ControlViewState) {
          default:
          case No3ControlViewState.Manual_Minimized:
            ControlViewState = No3ControlViewState.Manual;
            break;
          case No3ControlViewState.Automatic_Minimized:
            ControlViewState = No3ControlViewState.Automatic;
            break;
          case No3ControlViewState.Manual:
            ControlViewState = No3ControlViewState.Manual_Minimized;
            break;
          case No3ControlViewState.Automatic:
            ControlViewState = No3ControlViewState.Automatic_Minimized;
            break;
          }
        });
      }
    }

    INotifyPropertyChanged IPlugInControlViewModel.GA => GA;

    public ObservableCollection<string> Programs { get; } = new ObservableCollection<string>();
    public string SelectedProgram {
      get {
        return _selectedProgram;
      }
      set {
        if (_selectedProgram != value) {
          _selectedProgram = value;
          OnPropertyChanged();
          OnPropertyChanged("SelectedProgramDescription");
        }
      }
    }
    public string SelectedProgramDescription {
      get {
        return string.Format("This is a description what '{0}' is doing. This is just some more text.", SelectedProgram);
      }
    }

    public bool IsShown => ControlViewState == No3ControlViewState.Automatic || ControlViewState == No3ControlViewState.Manual;
    public bool IsRunning {
      get {
        return _isRunning;
      }
      set {
        if (_isRunning != value) {
          _isRunning = value;
          if (_isRunning) {
            string[] progrIds = SelectedProgram.Split(' ');
            if (progrIds != null && progrIds.Length == 2) {
              _patternGenerator.Start(int.Parse(progrIds[1]));
            }
          }
          else {
            _patternGenerator.Stop();
          }
          OnPropertyChanged();
        }
      }
    }

    private void UP_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.UPLNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.UPRTN, StepSize = 5, Value = rtn }
        };
        _mophApp.GoTo(pos);
      }
    }

    private void LO_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LOLNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LORTN, StepSize = 5, Value = rtn }
        };
        _mophApp.GoTo(pos);
      }
    }

    private void GA_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.GALNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.GARTN, StepSize = 5, Value = rtn }
        };
        _mophApp.GoTo(pos);
      }
    }

    private void OnCylinderPositionsChanged(IEnumerable<CylinderPosition> positions) {
      foreach (var pos in positions) {
        switch (pos.Cy) {
        default:
          break;
        case Cylinder.Upper:
          UP.LNGInt = pos.Lng;
          UP.RTNInt = pos.Rtn;
          break;
        case Cylinder.Lower:
          LO.LNGInt = pos.Lng;
          LO.RTNInt = pos.Rtn;
          break;
        case Cylinder.Platform:
          GA.LNGInt = pos.Lng;
          GA.RTNInt = pos.Rtn;
          break;
        }
      }
    }

  }
}
