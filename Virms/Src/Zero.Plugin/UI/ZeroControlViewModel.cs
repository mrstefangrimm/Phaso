namespace Virms.Zero.UI {
  using System.ComponentModel;
  using Virms.Common;
  using Virms.Common.UI;

  public enum ZeroControlViewState {
    Manual,
    Manual_Minimized,
    Automatic,
    Automatic_Minimized
  }

  public class ZeroControlViewModel : ZeroViewModel, IPlugInControlViewModel {

    private IMophAppProxy _mophApp;

    static ZeroControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(ZeroControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public ZeroControlViewModel(IMophAppProxy mophApp) {
      _mophApp = mophApp;
    }

    INotifyPropertyChanged IPlugInControlViewModel.GA => GA;
  }

}
