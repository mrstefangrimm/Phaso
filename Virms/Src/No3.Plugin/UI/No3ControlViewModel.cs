// Copyright (c) 2020-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
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

    private IMotionSystem _motionSystem;
    private No3ControlViewState _viewState;
    private bool _isRunning;
    private string _selectedProgram;

    static No3ControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(No3ControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public No3ControlViewModel(IMotionSystem motionSystem) {
      _motionSystem = motionSystem;
      ControlViewState = No3ControlViewState.Manual;

      foreach (var pattern in motionSystem.MotionPatterns) {
        Programs.Add(pattern.Name);
      }
      SelectedProgram = motionSystem.MotionPatterns.First().Name;

      UP.PropertyChanged += UP_PropertyChanged;
      LO.PropertyChanged += LO_PropertyChanged;
      GA.PropertyChanged += GA_PropertyChanged;

      UP.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      LO.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
      GA.PropertyChanged += (sender, arg) => OnPropertyChanged(arg.PropertyName);
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

    private void UP_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.UPLNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.UPRTN, StepSize = 5, Value = rtn }
        };
        _motionSystem.GoTo(pos);
      }
    }

    private void LO_PropertyChanged(object sender, PropertyChangedEventArgs e) {
      var internalProp = !((CylinderPropertyChangedEventArgs)e).External;
      if (internalProp) {
        CylinderViewModel cy = (CylinderViewModel)sender;
        var lng = (ushort)cy.LNGInt;
        var rtn = (ushort)cy.RTNInt;
        MophAppMotorTarget[] pos = new[] {
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LOLNG, StepSize = 5, Value = lng },
          new MophAppMotorTarget { Channel = (byte)ServoNumber.LORTN, StepSize = 5, Value = rtn }
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

          case (byte)ServoNumber.UPLNG:
            UP.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.UPRTN:
            UP.RTNInt = target.Value;
            break;

          case (byte)ServoNumber.LOLNG:
            LO.LNGInt = target.Value;
            break;
          case (byte)ServoNumber.LORTN:
            LO.RTNInt = target.Value;
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
