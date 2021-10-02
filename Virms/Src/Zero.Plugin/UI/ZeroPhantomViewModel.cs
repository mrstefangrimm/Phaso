
using Virms.Common.UI;

namespace Virms.Zero.UI {

  public class ZeroPhantomViewModel : ZeroViewModel, IPlugInPhantomViewModel {

    public ZeroPhantomViewModel() {
      LU.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      LL.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      RU.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      RL.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
      GA.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
    }
  }
}
