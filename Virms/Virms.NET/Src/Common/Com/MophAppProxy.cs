/* MophAppProxy.cs - ViphApp (C) motion phantom application.
 * Copyright (C) 2019-2020 by Stefan Grimm
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
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Threading;

namespace ViphApp.Common.Com {

  class SerialOutMessage {
    private const byte CMD = 2;
    private Dictionary<byte, byte[]> _servoData = new Dictionary<byte, byte[]>();

    public void Add(byte servo, UInt16 pos, UInt16 step) {
      var motorData = new byte[2];
      motorData[0] = (byte)((step << 4) | servo);
      motorData[1] = (byte)(pos);
      lock (_servoData) {
        if (_servoData.ContainsKey(servo)) {
          _servoData[servo] = motorData;
        }
        else {
          _servoData.Add(servo, motorData);
        }
      }
      //_servoData.Add(m, (byte)((step << 4) | (byte)m));
      //_servoData.Add((byte)(pos));
    }

    public void Add(SerialOutMessage moreData) {
      lock (_servoData) {
        moreData._servoData.Keys.ToList().ForEach(k => {
          if (_servoData.ContainsKey(k)) {
            _servoData[k] = moreData._servoData[k];
          }
          else {
            _servoData.Add(k, moreData._servoData[k]);
          }
        });
      }
    }

    public void Clear() {
      _servoData.Clear();
    }

    public byte[] Data {
      get {
        lock (_servoData) {
          int numBytes = _servoData.Values.Sum(x => x.Length);
          List<byte> serout = new List<byte>(1 + numBytes);
          serout.Add((byte)(CMD | (numBytes << 3)));
          _servoData.Values.ToList().ForEach(x => serout.AddRange(x));
          return serout.ToArray<byte>();
        }
        //byte[] serout = new byte[1 + _servoData.Count];
        //serout[0] = (byte)(CMD | (_servoData.Count << 3));
        //Array.Copy(_servoData.ToArray(), 0, serout, 1, _servoData.Count);
        //return serout;
      }
    }

  }

  public class MophAppProxy : IDisposable {

    private const int _portBaudRate = 9600; // 9600, 38400, 115200;

    public enum SyncState { Desynced, Synced }
    public SyncState State { get; private set; } = SyncState.Desynced;

    private SerialOutMessage _sendBuffer = new SerialOutMessage();
    private SerialPort _serialPort;
    private Timer _timer;
    private object _lockObject = new object();
    private bool _receivingText;
    private string _receivedText = string.Empty;
    private string _receivedCmd = string.Empty;

    public event EventHandler<LogOutputEventArgs> LogOutput;

    public MophAppProxy() {
      TimerCallback timerDelegate =
      new TimerCallback(delegate (object state) {
       lock(_lockObject) {
          var data = _sendBuffer.Data;
          if (data.Length > 1 && _serialPort != null && _serialPort.IsOpen) {
            _serialPort.Write(data, 0, data.Length);
            _sendBuffer.Clear();
          }
        }
      });
      _timer = new Timer(timerDelegate, null, 50, 50);
    }

    public void Dispose() {
      if (_timer != null) {
        _timer.Dispose();
        _timer = null;
      }
      SerialDisconnect();
    }

    public bool Connect(string comPort) {
      bool connected = SerialConnect(comPort);
      if (connected) {
        SendSync();
      }
      return connected;
    }

    public void Disconnect() {
      SerialDisconnect();
    }
    
    public void GoTo(MotionSystemMotorPosition[] positions) {
      SerialOutMessage cmd = new SerialOutMessage();
      foreach (var pos in positions) {
        cmd.Add(pos.Channel, pos.Value, pos.StepSize);
      }
      Send(cmd);
    }

    public void SetCommandRegister(byte cmd) {
      if (_serialPort != null && _serialPort.IsOpen) {
        lock (_lockObject) {
          byte[] syncMsg = new byte[1];
          syncMsg[0] = cmd;
          _serialPort.Write(syncMsg, 0, 1);
        }
      }
      else {
        LogOutput?.Invoke(this, new LogOutputEventArgs { Text = "Send 'Sync' failed since Serial Port is not open." });
      }
    }

    public void FreeMem() {
      if (_serialPort != null && _serialPort.IsOpen) {
        lock (_lockObject) {
          byte[] syncMsg = new byte[1];
          syncMsg[0] = 19;
          _serialPort.Write(syncMsg, 0, 1);
        }
      }
      else {
        LogOutput?.Invoke(this, new LogOutputEventArgs { Text = "Send 'Sync' failed since Serial Port is not open." });
      }
    }

    private void Send(SerialOutMessage data) {
      if (_serialPort != null && _serialPort.IsOpen) {
        lock (_lockObject) {
          //var seroutbytes = data.Data;
          //_serialPort.Write(seroutbytes, 0, seroutbytes.Length);
          //_timer.Change(5000, 5000);
          _sendBuffer.Add(data);
        }
      }
      else {
        LogOutput?.Invoke(this, new LogOutputEventArgs { Text = "Send failed since Serial Port is not open." });
      }
    }

    private void SendSync() {
      if (_serialPort != null && _serialPort.IsOpen) {
        lock (_lockObject) {
          byte[] syncMsg = new byte[1];
          syncMsg[0] = 11;
          _serialPort.Write(syncMsg, 0, 1);
        }
      }
      else {
        LogOutput?.Invoke(this, new LogOutputEventArgs { Text = "Send 'Sync' failed since Serial Port is not open." });
      }
    }

    private bool SerialConnect(string comPort) {
      SerialDisconnect();

      string logMsg = null;
      lock (_lockObject) {
        if (_serialPort == null) {
          _serialPort = new SerialPort(comPort, _portBaudRate);
          _serialPort.DataReceived += OnSerialPortDataReceived;
          try {
            _serialPort.Open();
            State = SyncState.Desynced;
          }
          catch (Exception e) {
            if (e.InnerException != null) {
              logMsg = e.InnerException.Message;
            }
            else {
              logMsg = e.Message;
            }
            SerialDisconnect();
          }
        }
      }
      if (logMsg != null) {
        LogOutput?.Invoke(this, new LogOutputEventArgs { Text = logMsg });
      }
      return _serialPort != null;
    }

    private void SerialDisconnect() {
      lock (_lockObject) {
        if (_serialPort != null) {
          _serialPort.DataReceived -= OnSerialPortDataReceived;
          _serialPort.Close();
          _serialPort.Dispose();
          _serialPort = null;
        }
      }
      State = SyncState.Desynced;
    }

    private void OnSerialPortDataReceived(object sender, SerialDataReceivedEventArgs e) {
      char[] serin = null;
      lock (_lockObject) {
        if (_serialPort != null) {
          serin = new char[_serialPort.BytesToRead];
          _serialPort.Read(serin, 0, serin.Length);
        }
      }
      if (serin == null) { return; }
      
      if (State == SyncState.Desynced) {
        _receivedText += new string(serin);
        int index = _receivedText.IndexOf("Synced");
        if (index != -1) {
          string syncedData = _receivedText.Remove(0, index + 6);
          _receivedText = string.Empty;

          _receivingText = true;
          syncedData.ToList().ForEach(ch => {
            if (_receivingText && ch != '|') {
              _receivedText += ch;
            }
            if (ch == '|') {
              _receivingText = !_receivingText;
            }
          });
          State = SyncState.Synced;
        }
        LogOutput?.Invoke(this, new LogOutputEventArgs { Text = State + _receivedText });
      }
      else if (State == SyncState.Synced) {

        serin.ToList().ForEach(ch => {
          if (ch == '|') {
            _receivingText = !_receivingText;

            if (!_receivingText) {
              var cmd = _receivedCmd;
              _receivedCmd = string.Empty;
              if (cmd.Length > 2 && cmd[0] == 'K') {
                var freeMem = cmd.Substring(1);
                var msg = string.Format("Free memory: {0} Bytes", freeMem);
                LogOutput?.Invoke(this, new LogOutputEventArgs { Text = msg });
              }
            }
          }
          else {
            if (_receivingText) {
              _receivedText += ch;
            }
            else {
              _receivedCmd += ch;
            }
          }
        });

        int index = _receivedText.IndexOf("\r\n");
        if (index != -1) {
          string msg = _receivedText.Substring(0, index);
          LogOutput?.Invoke(this, new LogOutputEventArgs { Text = msg });
          _receivedText = _receivedText.Substring(index+2);
        }
      }
    }

  }
}
