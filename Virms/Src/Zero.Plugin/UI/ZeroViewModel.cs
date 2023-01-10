

using System.ComponentModel;
namespace Virms.Zero.UI {

  using System.Runtime.CompilerServices;
  using Virms.Common.UI;

  public class ZeroViewModel : INotifyPropertyChanged {

    public CylinderViewModel GA { get; } = new CylinderViewModel();

    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}
