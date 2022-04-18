// Copyright (c) 2018-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Gris5a.UI {
  using System.Collections.ObjectModel;
  using System.ComponentModel;
  using System.Linq;
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

    private IMotionSystem _motionSystem;
    private Gri5aControlViewState _viewState;
    private bool _isRunning;
    private string _selectedProgram;
    //private MotionPatternEngine _patternEngine;
    static Gris5aControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(object));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
      QuickConverter.EquationTokenizer.AddNamespace("Virms.Gris5a.UI", typeof(Gri5aControlViewState).Assembly);
    }

    public Gris5aControlViewModel(IMotionSystem motionSystem) {
      _motionSystem = motionSystem;
      ControlViewState = Gri5aControlViewState.Manual;

      foreach(var pattern in motionSystem.MotionPatterns) {
        Programs.Add(pattern.Name);
      }
      SelectedProgram = motionSystem.MotionPatterns.First().Name;

      LU.PropertyChanged += LU_PropertyChanged;
      LL.PropertyChanged += LL_PropertyChanged;
      RU.PropertyChanged += RU_PropertyChanged;
      RL.PropertyChanged += RL_PropertyChanged;
      GA.PropertyChanged += GA_PropertyChanged;

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
          var runningPattern = _motionSystem.MotionPatterns.FirstOrDefault(x => x.Name == SelectedProgram);
          if (_isRunning) {           
            runningPattern.Start();
            runningPattern.ServoPositionChanged += OnServoPositionChanged;
              /*_patternEngine.Start("Prog", @"

let NAME = 'My Program'
const PRESETTIMERINCR = 40
let preSetTimer = 0;

var stepsz = 10
var lulng = 0, lurtn = 0, rulng = 0, rurtn = 0, lllng = 0, llrtn = 0, rllng = 0, rlrtn = 0, galng = 0, gartn = 0

function Prog() {
  let target = 127 + 80 * MathEx.Sin4((preSetTimer - 3000) / 2500.0 * Math.PI);

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
          else {
            runningPattern.Stop();
            runningPattern.ServoPositionChanged -= OnServoPositionChanged;
            //_patternEngine.Stop();
          }
          OnPropertyChanged();
        }
      }
    }
       
    private void LU_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new [] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LULNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LURTN, StepSize = 5, Value = rtn }
        };
        _motionSystem.GoTo(pos);
      }
    }

    private void LL_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LLLNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LLRTN, StepSize = 5, Value = rtn }
        };
        _motionSystem.GoTo(pos);
      }
    }

    private void RU_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.RULNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.RURTN, StepSize = 5, Value = rtn }
        };
        _motionSystem.GoTo(pos);
      }
    }

    private void RL_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.RLLNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.RLRTN, StepSize = 5, Value = rtn }
        };
        _motionSystem.GoTo(pos);
      }
    }

    private void GA_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.GALNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.GARTN, StepSize = 5, Value = rtn }
        };
        _motionSystem.GoTo(pos);
      }
    }

    private void OnServoPositionChanged(object sender, MotionAxisChangedEventArgs args) {
      foreach (var target in args.Targets) {
        switch (target.Channel) {
          default: break;

          case (byte)ServoNumber.LULNG:
            LU.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.LURTN:
            LU.RTNInt = target.Value;
            break;

          case (byte)ServoNumber.LLLNG:
            LL.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.LLRTN:
            LL.RTNInt = target.Value;
            break;

          case (byte)ServoNumber.RULNG:
            RU.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.RURTN:
            RU.RTNInt = target.Value;
            break;

          case (byte)ServoNumber.RLLNG:
            RL.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.RLRTN:
            RL.RTNInt = target.Value;
            break;

          case (byte)ServoNumber.GALNG:
            GA.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.GARTN:
            GA.RTNInt = target.Value;
            break;
        }
      }      
    }
  }
}
