// Copyright (c) 2018-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using Virms.Common.Com;
using Virms.Common.UI;

namespace Virms.Gris5a.UI {

  public enum Gri5aControlViewState {
    Manual,
    Manual_Minimized,
    Automatic,
    Automatic_Minimized
  }

  public class Gris5aControlViewModel : Gris5aViewModel, IPlugInControlViewModel {

    private MophAppProxy _mophApp;
    private Gri5aControlViewState _viewState;
    private bool _isRunning;
    private string _selectedProgram;
    private MotionPatternGenerator _patternGenerator;

    static Gris5aControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(Gri5aControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public Gris5aControlViewModel(MophAppProxy mophApp) {
      _mophApp = mophApp;
      ControlViewState = Gri5aControlViewState.Manual;

      Programs.Add("Program 1");
      Programs.Add("Program 2");
      Programs.Add("Program 3");
      Programs.Add("Program 4");
      Programs.Add("Program 5");
      Programs.Add("Program 6");
      Programs.Add("Program 7");
      Programs.Add("Program 8");
      SelectedProgram = "Program 1";
      
      LU.PropertyChanged += LU_PropertyChanged;
      LL.PropertyChanged += LL_PropertyChanged;
      RU.PropertyChanged += RU_PropertyChanged;
      RL.PropertyChanged += RL_PropertyChanged;
      GA.PropertyChanged += GA_PropertyChanged;

      _patternGenerator = new MotionPatternGenerator(OnCylinderPositionsChanged);
    }

    public Gri5aControlViewState ControlViewState {
      get { return _viewState; }
      private set {
        if (_viewState != value) {
          _viewState = value;
          OnPropertyChanged();
        }
      }
    }

    public ICommand DoSetManual {
      get {
        return new RelayCommand<object>(param => {
          ControlViewState = Gri5aControlViewState.Manual;
        });
      }
    }

    public ICommand DoSetAutomatic {
      get {
        return new RelayCommand<object>(param => {
          ControlViewState = Gri5aControlViewState.Automatic;
        });
      }
    }

    public ICommand DoSetMinimized {
      get {
        return new RelayCommand<object>(param => {
          switch (ControlViewState) {
          default:
          case Gri5aControlViewState.Manual_Minimized:
            ControlViewState = Gri5aControlViewState.Manual;
            break;
          case Gri5aControlViewState.Automatic_Minimized:
            ControlViewState = Gri5aControlViewState.Automatic;
            break;
          case Gri5aControlViewState.Manual:
            ControlViewState = Gri5aControlViewState.Manual_Minimized;
            break;
          case Gri5aControlViewState.Automatic:
            ControlViewState = Gri5aControlViewState.Automatic_Minimized;
            break;
          }});
      }
    }

    INotifyPropertyChanged IPlugInControlViewModel.GA => GA;

    public ObservableCollection<string> Programs { get; } = new ObservableCollection<string>();
    public string SelectedProgram { get {
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

    private void LU_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new [] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LULNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LURTN, StepSize = 5, Value = rtn }
        };
        _mophApp.GoTo(pos);
      }
    }

    private void LL_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LLLNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.LLRTN, StepSize = 5, Value = rtn }
        };
        _mophApp.GoTo(pos);
      }
    }

    private void RU_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.RULNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.RURTN, StepSize = 5, Value = rtn }
        };
        _mophApp.GoTo(pos);
      }
    }

    private void RL_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp && _mophApp.State == MophAppProxy.SyncState.Synced) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorPosition[] pos = new[] {
          new MophAppMotorPosition { Channel = (byte)ServoNumber.RLLNG, StepSize = 5, Value = lng },
          new MophAppMotorPosition { Channel = (byte)ServoNumber.RLRTN, StepSize = 5, Value = rtn }
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
        default: break;
        case Cylinder.LeftUpper:
          LU.LNGInt = pos.Lng;
          LU.RTNInt = pos.Rtn;
          break;
        case Cylinder.LeftLower:
          LL.LNGInt = pos.Lng;
          LL.RTNInt = pos.Rtn;
          break;
        case Cylinder.RightUpper:
          RU.LNGInt = pos.Lng;
          RU.RTNInt = pos.Rtn;
          break;
        case Cylinder.RightLower:
          RL.LNGInt = pos.Lng;
          RL.RTNInt = pos.Rtn;
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
