using HelixToolkit.Wpf;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Media3D;

namespace ViphApp.No3.UI.Views {
  /// <summary>
  /// Interaction logic for Gris5aView.xaml
  /// </summary>
  public partial class No3PhantomView : UserControl {
    public No3PhantomView() {
      InitializeComponent();
    }

    private void OnMainViewCameraChanged(object sender, RoutedEventArgs e) {

      var mainPosDistance = DistanceTo(MainView.Camera.Position, new Point3D());
      SmallView.Camera.Position = MainView.Camera.Position.Multiply(1000d / mainPosDistance);

      var mainLookDistance = DistanceTo(MainView.Camera.LookDirection, new Vector3D());
      SmallView.Camera.LookDirection = MainView.Camera.LookDirection * 1000d / mainLookDistance;
      //SmallView.Camera.Position = new Point3D(MainView.Camera.Position.X, -1000, MainView.Camera.Position.Z);
      //SmallView.Camera.LookDirection = new Vector3D(MainView.Camera.LookDirection.X, 1000, MainView.Camera.LookDirection.Z);

      SmallView.Camera.UpDirection = MainView.Camera.UpDirection;
      //CameraHelper.Copy(MainView.Camera, SmallView.Camera);
    }

    public double DistanceTo(Point3D a, Point3D b) {
      return Math.Sqrt(Math.Pow(a.X - b.X, 2) + Math.Pow(a.Y - b.Y, 2) + Math.Pow(a.Z - b.Z, 2));
    }

    public double DistanceTo(Vector3D a, Vector3D b) {
      return Math.Sqrt(Math.Pow(a.X - b.X, 2) + Math.Pow(a.Y - b.Y, 2) + Math.Pow(a.Z - b.Z, 2));
    }

  } 
}
