// Copyright (c) 2018-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Gris5a.UI {
  using System.Collections.Generic;
  using System.Collections.ObjectModel;
  using System.ComponentModel;
  using System.Windows.Input;
  using Virms.Common;
  using Virms.Common.UI;

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
    //private MotionPatternEngine _patternEngine;
    static Gris5aControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(object));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
      QuickConverter.EquationTokenizer.AddNamespace("Virms.Gris5a.UI", typeof(Gri5aControlViewState).Assembly);
    }

    public Gris5aControlViewModel(IMophAppProxy mophApp) {
      _mophApp = mophApp as MophAppProxy;
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
      //_patternEngine = new MotionPatternEngine(OnCylinderPositionsChanged);
    }

    public Gri5aControlViewState ControlViewState {
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

    public bool IsShown => ControlViewState == Gri5aControlViewState.Automatic || ControlViewState == Gri5aControlViewState.Manual;
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
              /*_patternEngine.Start("Prog", @"

let NAME = 'My Program'
const PRESETTIMERINCR = 40
let preSetTimer = 0;

var stepsz = 10
var lulng = 0, lurtn = 0, rulng = 0, rurtn = 0, lllng = 0, llrtn = 0, rllng = 0, rlrtn = 0, galng = 0, gartn = 0

function Prog() {
  let target = 127 + 80 * Math.sin((preSetTimer - 3000) / 2500.0 * Math.PI);

  lulng = target;

  if (preSetTimer == 7960) {
    preSetTimer = 3000;
  }
  else {
    preSetTimer += PRESETTIMERINCR;
  }
}
");*/
            }
          }
          else {
            _patternGenerator.Stop();
            //_patternEngine.Stop();
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

    private void OnCylinderPositionsChanged(IEnumerable<Virms.Common.CylinderPosition> positions) {
      foreach (var pos in positions) {
        switch (pos.Cy) {
        default: break;
        case Common.Cylinder.LeftUpper:
          LU.LNGInt = pos.Lng;
          LU.RTNInt = pos.Rtn;
          break;
        case Common.Cylinder.LeftLower:
          LL.LNGInt = pos.Lng;
          LL.RTNInt = pos.Rtn;
          break;
        case Common.Cylinder.RightUpper:
          RU.LNGInt = pos.Lng;
          RU.RTNInt = pos.Rtn;
          break;
        case Common.Cylinder.RightLower:
          RL.LNGInt = pos.Lng;
          RL.RTNInt = pos.Rtn;
          break;
        case Common.Cylinder.Platform:
          GA.LNGInt = pos.Lng;
          GA.RTNInt = pos.Rtn;
          break;
        }
      }     
    }
  }
}
