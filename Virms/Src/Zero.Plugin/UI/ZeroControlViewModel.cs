
using System.ComponentModel;
using Virms.Common.Com;
using Virms.Common.UI;

namespace Virms.Zero.UI {

  public enum ZeroControlViewState {
    Manual,
    Manual_Minimized,
    Automatic,
    Automatic_Minimized
  }

  public class ZeroControlViewModel : ZeroViewModel, IPlugInControlViewModel {

    private MophAppProxy _mophApp;

    static ZeroControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(ZeroControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    public ZeroControlViewModel(MophAppProxy mophApp) {
      _mophApp = mophApp;
    }

    INotifyPropertyChanged IPlugInControlViewModel.GA => GA;
  }

}
