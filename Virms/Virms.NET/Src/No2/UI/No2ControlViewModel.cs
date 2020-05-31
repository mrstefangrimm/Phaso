/* No2ControlViewModel.cs - ViphApp (C) motion phantom application.
 * Copyright (C) 2020 by Stefan Grimm
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with the ViphApp software.  If not, see
 * <http://www.gnu.org/licenses/>.
 */

using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using ViphApp.Common.Com;
using ViphApp.Common.UI;

namespace ViphApp.No2.UI {

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

    public No2ControlViewModel(MophAppProxy mophApp) {
      _mophApp = mophApp;
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
        MotionSystemMotorPosition[] pos = new[] {
          new MotionSystemMotorPosition { Channel = (byte)ServoNumber.LLNG, StepSize = 5, Value = lng },
          new MotionSystemMotorPosition { Channel = (byte)ServoNumber.LRTN, StepSize = 5, Value = rtn }
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
        MotionSystemMotorPosition[] pos = new[] {
          new MotionSystemMotorPosition { Channel = (byte)ServoNumber.RLNG, StepSize = 5, Value = lng },
          new MotionSystemMotorPosition { Channel = (byte)ServoNumber.RRTN, StepSize = 5, Value = rtn }
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
        MotionSystemMotorPosition[] pos = new[] {
          new MotionSystemMotorPosition { Channel = (byte)ServoNumber.GALNG, StepSize = 5, Value = lng },
          new MotionSystemMotorPosition { Channel = (byte)ServoNumber.GARTN, StepSize = 5, Value = rtn }
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
