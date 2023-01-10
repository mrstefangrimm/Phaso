// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Isocal.UI {
  using System.ComponentModel;
  using Virms.Common.UI;

  public enum IsocalControlViewState {
    Manual,
    Manual_Minimized,
    Automatic,
    Automatic_Minimized
  }

  public class IsocalControlViewModel : IsocalViewModel, IPlugInControlViewModel {

    static IsocalControlViewModel() {
      QuickConverter.EquationTokenizer.AddNamespace(typeof(IsocalControlViewState));
      QuickConverter.EquationTokenizer.AddNamespace(typeof(System.Windows.Visibility));
    }

    INotifyPropertyChanged IPlugInControlViewModel.GA => GA;
  }

}
