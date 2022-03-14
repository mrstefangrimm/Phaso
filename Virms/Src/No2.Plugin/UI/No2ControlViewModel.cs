// Copyright (c) 2020-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using Virms.Common;
using Virms.Common.UI;

namespace Virms.No2.UI {

  public enum No2ControlViewState {
    Manual,
    Manual_Minimized,
    Automatic,
    Automatic_Minimized
  }

  public class No2ControlViewModel : No2ViewModel, IPlugInControlViewModel {

    private MophAppProxy _mophApp;
    private No2ControlViewState _viewState;
    private bool _isRunning;
    private string _selectedProgram;
    private MotionPatternGenerator _patternGenerator;

    static No2ControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(No2ControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public No2ControlViewModel(IMophAppProxy mophApp) {
      _mophApp = mophApp as MophAppProxy;
      ControlViewState = No2ControlViewState.Manual;

      Programs.Add("Program 1");
      Programs.Add("Program 2");
      Programs.Add("Program 3");
      Programs.Add("Program 4");
      Programs.Add("Program 5");
      Programs.Add("Program 6");
      Programs.Add("Program 7");
      Programs.Add("Program 8");
      SelectedProgram = "Program 1";

      L.PropertyChanged += L_PropertyChanged;
      R.PropertyChanged += R_PropertyChanged;
      GA.PropertyChanged += GA_PropertyChanged;

      L.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      R.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      GA.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);

      _patternGenerator = new MotionPatternGenerator(OnCylinderPositionsChanged);
    }

    public No2ControlViewState ControlViewState {
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
          ControlViewState = No2ControlViewState.Manual;
        });
      }
    }

    public ICommand DoSetAutomatic {
      get {
        return new RelayCommand<object>(param => {
          ControlViewState = No2ControlViewState.Automatic;
        });
      }
    }

    public ICommand DoSetMinimized {
      get {
        return new RelayCommand<object>(param => {
          switch (ControlViewState) {
          default:
          case No2ControlViewState.Manual_Minimized:
            ControlViewState = No2ControlViewState.Manual;
            break;
          case No2ControlViewState.Automatic_Minimized:
            ControlViewState = No2ControlViewState.Automatic;
            break;
          case No2ControlViewState.Manual:
            ControlViewState = No2ControlViewState.Manual_Minimized;
            break;
          case No2ControlViewState.Automatic:
            ControlViewState = No2ControlViewState.Automatic_Minimized;
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

    public bool IsShown => ControlViewState == No2ControlViewState.Automatic || ControlViewState == No2ControlViewState.Manual;
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

    private void L_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LLNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LRTN, StepSize = 5, Value = rtn }
        };
        _mophApp.GoTo(pos);
      }
    }

    private void R_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.RLNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.RRTN, StepSize = 5, Value = rtn }
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
        case Cylinder.Left:
          L.LNGInt = pos.Lng;
          L.RTNInt = pos.Rtn;
          break;
        case Cylinder.Right:
          R.LNGInt = pos.Lng;
          R.RTNInt = pos.Rtn;
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
