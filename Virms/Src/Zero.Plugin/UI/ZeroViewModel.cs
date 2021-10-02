

using System.ComponentModel;
using System.Runtime.CompilerServices;
using Virms.Common.UI;

namespace Virms.Zero.UI {

  public class ZeroViewModel : INotifyPropertyChanged {

    private static CylinderViewModel _lu = new CylinderViewModel();
    private static CylinderViewModel _ru = new CylinderViewModel();
    private static CylinderViewModel _ll = new CylinderViewModel();
    private static CylinderViewModel _rl = new CylinderViewModel();
    private static CylinderViewModel _ga = new CylinderViewModel();

    public CylinderViewModel LU { get { return _lu; } }
    public CylinderViewModel RU { get { return _ru; } }
    public CylinderViewModel LL { get { return _ll; } }
    public CylinderViewModel RL { get { return _rl; } }
    public CylinderViewModel GA { get { return _ga; } }
    
    public event PropertyChangedEventHandler PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string propertyName = null) {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
  }
}
