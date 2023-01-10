// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Isocal.UI {
  using System.ComponentModel;
  using System.Runtime.CompilerServices;
  using Virms.Common.UI;

  public class IsocalViewModel : INotifyPropertyChanged {

    public CylinderViewModel GA { get; } = new CylinderViewModel();

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}
