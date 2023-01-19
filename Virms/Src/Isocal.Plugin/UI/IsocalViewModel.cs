// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Isocal.UI {
  using System.ComponentModel;
  using System.Runtime.CompilerServices;
  using Virms.Common.UI;

  public class IsocalViewModel : INotifyPropertyChanged {

    private static ScalarViewModel _x1 = new(21);
    private static ScalarViewModel _x2 = new(21);
    private static ScalarViewModel _y1 = new(21);
    private static ScalarViewModel _y2 = new(21);
    private static RotationViewModel _collRtn = new();
    private static RotationViewModel _gantryRtn = new();
    private static ScalarViewModel _couchLng = new(0);

    public ScalarViewModel X1 { get { return _x1; } }
    public ScalarViewModel X2 { get { return _x2; } }
    public ScalarViewModel Y1 { get { return _y1; } }
    public ScalarViewModel Y2 { get { return _y2; } }
    public RotationViewModel CollRtn { get { return _collRtn; } }
    public RotationViewModel GantryRtn { get { return _gantryRtn; } }
    public ScalarViewModel CouchLng { get { return _couchLng; } }

    public CylinderViewModel GA { get; } = new();

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}
