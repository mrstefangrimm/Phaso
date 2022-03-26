// Copyright (c) 2020-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
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

    private IMotionSystem _motionSystem;
    private No2ControlViewState _viewState;
    private bool _isRunning;
    private string _selectedProgram;

    static No2ControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(No2ControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public No2ControlViewModel(IMotionSystem motionSystem) {
      _motionSystem = motionSystem;
      ControlViewState = No2ControlViewState.Manual;

      foreach (var pattern in motionSystem.MotionPatterns) {
        Programs.Add(pattern.Name);
      }
      SelectedProgram = motionSystem.MotionPatterns.First().Name;

      L.PropertyChanged += L_PropertyChanged;
      R.PropertyChanged += R_PropertyChanged;
      GA.PropertyChanged += GA_PropertyChanged;

      L.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      R.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      GA.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
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
          var runningPattern = _motionSystem.MotionPatterns.FirstOrDefault(x => x.Name == SelectedProgram);
          if (_isRunning) {
            runningPattern.Start();
            runningPattern.ServoPositionChanged += OnServoPositionChanged;
          }
          else {
            runningPattern.Stop();
            runningPattern.ServoPositionChanged -= OnServoPositionChanged;
          }
          OnPropertyChanged();
        }
      }
    }

    private void L_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LLNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LRTN, StepSize = 5, Value = rtn }
        };
        _motionSystem.GoTo(pos);
      }
    }

    private void R_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.RLNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.RRTN, StepSize = 5, Value = rtn }
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

          case (byte)ServoNumber.LLNG:
            L.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.LRTN:
            L.RTNInt = target.Value;
            break;

          case (byte)ServoNumber.RLNG:
            R.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.RRTN:
            R.RTNInt = target.Value;
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
