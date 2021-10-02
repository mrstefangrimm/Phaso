// Copyright (c) 2018-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.ComponentModel;
using System.Windows;
using System.Windows.Media;
using System.Windows.Threading;

namespace Virms.App.UI.Views {

  /// <summary>
  /// Interaction logic for MainWindow.xaml
  /// </summary>
  public partial class MainWindow : Window {

    private DispatcherTimer _timer;
    private PointCollection _points;

    public MainWindow() {
      InitializeComponent();

      _points = new PointCollection(100);
      for (int n = 0; n < 100; n++) {
        _points.Add(new Point());
      }
      GatingPlatformHistory.Points = _points;

      EventHandler timerDelegate =
        new EventHandler(delegate (object sender, EventArgs e) {
          for (int n = 1; n < 100; n++) {
            _points[n - 1] = new Point(_points[n - 1].X, _points[n].Y);
          }
          _points[99] = new Point(_points[99].X, Pointer.Y1);
        });
      _timer = new DispatcherTimer(DispatcherPriority.ApplicationIdle);
      _timer.Interval = TimeSpan.FromMilliseconds(200);
      _timer.Tick += timerDelegate;
      _timer.Start();
    } 

    protected override void OnClosing(CancelEventArgs e) {
      base.OnClosing(e);
      if (_timer != null) {
        _timer.Stop();
        _timer = null;
      }
    }

    private void _OnSizeChanged(object sender, SizeChangedEventArgs e) {
      var m = Pointer.RenderTransform.Value;
      m.OffsetY = e.NewSize.Height / 2.0;
      Pointer.RenderTransform = new MatrixTransform(m);
      GatingPlatformHistory.RenderTransform = new MatrixTransform(m);

      double xStep = e.NewSize.Width / 100.0;
      for (int n = 0; n < 100; n++) {
        _points[n] = new Point(n * xStep, _points[n].Y);
      }
    }

    //private void _OnGatingPlatform(object sender, RoutedEventArgs e) {
    //  var axis = new Vector3D(0, 1, 0);
    //  int angle = 10;
    //  var matrix = gatingPlatform.Transform.Value;
    //  matrix.RotateAt(new Quaternion(axis, angle), new Point3D(60, 140, 194));
    //  gatingPlatform.Transform = new MatrixTransform3D(matrix);
    //}

  }
}
