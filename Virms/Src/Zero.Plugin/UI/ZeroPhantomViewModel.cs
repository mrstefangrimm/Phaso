namespace Virms.Zero.UI {

  using Virms.Common.UI;

  public class ZeroPhantomViewModel : ZeroViewModel, IPlugInPhantomViewModel {

    public ZeroPhantomViewModel() {
      GA.PropertyChanged += (sender, args) => { if (((CylinderPropertyChangedEventArgs)args).External) OnPropertyChanged(args.PropertyName); };
    }
  }
}
