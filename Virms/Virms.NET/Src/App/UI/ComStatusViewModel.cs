/* ComStatusViewModel.cs - ViphApp (C) motion phantom application.
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

using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO.Ports;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using ViphApp.Common.Com;
using ViphApp.Common.UI;

namespace ViphApp.App.UI {

  public class ComStatusViewModel : INotifyPropertyChanged {

    private MainViewModel _parent;
    private MophAppProxy _mophApp;
    private bool _isConnected;

    public ComStatusViewModel(MainViewModel parent, MophAppProxy mophApp) {
      _parent = parent;
      _mophApp = mophApp;
      _mophApp.LogOutput += OnLogOutput;
      SelectedSerialPort = "None";
      SerialPorts.Add(SelectedSerialPort);
      foreach (var port in SerialPort.GetPortNames()) {
        SerialPorts.Add(port);
      }
    }

    public ObservableCollection<string> SerialPorts { get; } = new ObservableCollection<string>();
    public string SelectedSerialPort { get; set; }
    public string LogOutput { get; private set; } = string.Empty;
    public string CommandRegister { get; set; } = "0";

    public bool IsConnected {
      get { return _isConnected; }
      set {
        if (_isConnected != value) {
          _isConnected = value;
          if (_isConnected) {
            _isConnected = _mophApp.Connect(SelectedSerialPort);
            if (!IsConnected) {
              SelectedSerialPort = "None";
              OnPropertyChanged("SelectedSerialPort");
              OnPropertyChanged("IsConnected");
            }
          }
          else {
            _mophApp.Disconnect();
          }
        }
      }
    }

    public ICommand DoShowStatusDetails {
      get {
        return new RelayCommand<object>(param => {
          if (_parent.ComStatusViewState == ComStatusViewState.Minimized) {
            _parent.ComStatusViewState = ComStatusViewState.Details;
          }
          else {
            _parent.ComStatusViewState = ComStatusViewState.Minimized;
          }
          OnPropertyChanged("SelectedSerialPort");
          OnPropertyChanged("IsConnected");
        });
      }
    }

    public ICommand DoShowStatusMaximized {
      get {
        return new RelayCommand<object>(param => {
          if (_parent.MainViewState == MainViewState.StatusViewMaximized) {
            _parent.ComStatusViewState = ComStatusViewState.Details;
            _parent.MainViewState = MainViewState.Normal;
          }
          else {
            _parent.ComStatusViewState = ComStatusViewState.Maximized;
            _parent.MainViewState = MainViewState.StatusViewMaximized;
          }
          OnPropertyChanged("SelectedSerialPort");
          OnPropertyChanged("IsConnected");
        });
      }
    }

    public ICommand DoRefreshSerialPorts {
      get {
        return new RelayCommand<object>(param => {
          SerialPorts.Clear();
          SelectedSerialPort = "None";
          SerialPorts.Add(SelectedSerialPort);
          foreach (var port in SerialPort.GetPortNames()) {
            SerialPorts.Add(port);
          }
          OnPropertyChanged("SerialPorts");
          OnPropertyChanged("SelectedSerialPort");
        });
      }
    }

    public ICommand DoSetCommandRegister {
      get {
        return new RelayCommand<object>(param => {
          int cmd;
          if (int.TryParse(CommandRegister, out cmd)) {
            if (cmd > 0 && cmd < 256) {
              _mophApp.SetCommandRegister((byte)cmd);
            }
          }
        });
      }
    }    

    internal void OnLogOutput(object sender, LogOutputEventArgs args) {
      LogOutput = LogOutput.Insert(0, args.Text + Environment.NewLine);
      OnPropertyChanged("LogOutput");
    }

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

  }
}
