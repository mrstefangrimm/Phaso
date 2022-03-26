// Copyright (c) 2019-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.App {
  using System;
  using System.Collections.ObjectModel;
  using System.Threading;
  using System.Windows;
  using Virms.App.Plugin;
  using Virms.Common;
  using Virms.Common.Plugin;

  public partial class App : Application {  

    private CancellationTokenSource _cancellationTokenSource;
    private IMophAppProxy _mophApp;

    protected override void OnStartup(StartupEventArgs e) {
      base.OnStartup(e);

      _cancellationTokenSource = new CancellationTokenSource();

      _mophApp = new MophAppProxyFactory<MophAppProxy>().Create();

      string pluginPath = Environment.CurrentDirectory;

      var motionSystemFac = new MotionSystemFactory();
      var gris5aMsBuilder = motionSystemFac.CreatePluginBuilder(string.Format(@"{0}\Virms.Gris5a.dll", pluginPath));
      var no2MsBuilder = motionSystemFac.CreatePluginBuilder(string.Format(@"{0}\Virms.No2.dll", pluginPath));
      var no3MsBuilder = motionSystemFac.CreatePluginBuilder(string.Format(@"{0}\Virms.No3.dll", pluginPath));

      var pluginFactory = new PluginFactory();
      //var zeroPluginBuilder = new Zero.ZeroPluginBuilder();
      var zeroPluginBuilder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\Virms.Zero.Plugin.dll", pluginPath));
      var gris5aPluginBuilder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\Virms.Gris5a.Plugin.dll", pluginPath));
      var no2PluginBuilder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\Virms.No2.Plugin.dll", pluginPath));
      var no3PluginBuilder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\Virms.No3.Plugin.dll", pluginPath));

      ObservableCollection<IPluginPhantom> availablePhantoms = new ObservableCollection<IPluginPhantom>() {
        gris5aPluginBuilder.BuildPluginPhantom(gris5aMsBuilder.BuildMotionSystem(_mophApp)),
        no2PluginBuilder.BuildPluginPhantom(no2MsBuilder.BuildMotionSystem(_mophApp)),
        no3PluginBuilder.BuildPluginPhantom(no3MsBuilder.BuildMotionSystem(_mophApp)),
        zeroPluginBuilder.BuildPluginPhantom(null),
      };

      // 20210929 - Adding styles works when in App.xaml commented out (must be first entries due to docs.
      //var rd1 = new Uri("pack://application:,,,/Virms.Common;component/UI/Views/ComboboxStylesAndTemplates.xaml", UriKind.RelativeOrAbsolute);
      //Resources.MergedDictionaries.Add(new ResourceDictionary() { Source = rd1 });
      //var rd2 = new Uri("pack://application:,,,/Virms.Common;component/UI/Views/ButtonStylesAndTemplates.xaml", UriKind.RelativeOrAbsolute);
      //Resources.MergedDictionaries.Add(new ResourceDictionary() { Source = rd2 });

      //var rsrc = "/Virms.Zero;component/UI/Views/ZeroDictionary.xaml";
      //var currentRsrc = new Uri(rsrc, UriKind.RelativeOrAbsolute);
      //Resources.MergedDictionaries.Add(LoadComponent(currentRsrc) as ResourceDictionary);
      var rd3 = new Uri("pack://application:,,,/Virms.Zero.Plugin;component/UI/Views/ZeroDictionary.xaml", UriKind.RelativeOrAbsolute);
      Resources.MergedDictionaries.Add(new ResourceDictionary() { Source = rd3 });

      var mainViewModel = new UI.MainViewModel(_mophApp, availablePhantoms);
      var app = new UI.Views.MainWindow();
      app.DataContext = mainViewModel;

      var templ = zeroPluginBuilder.BuildPhantomTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = zeroPluginBuilder.BuildControlTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = gris5aPluginBuilder.BuildPhantomTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = gris5aPluginBuilder.BuildControlTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no2PluginBuilder.BuildPhantomTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no2PluginBuilder.BuildControlTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no3PluginBuilder.BuildPhantomTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no3PluginBuilder.BuildControlTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      app.Closing += mainViewModel.OnClosing;

      //var aaasss = AppDomain.CurrentDomain.GetAssemblies();
      app.Show();
    }

    protected override void OnExit(ExitEventArgs e) {
      base.OnExit(e);
      _cancellationTokenSource.Cancel();
      if (_mophApp is IDisposable) {
        ((IDisposable)_mophApp).Dispose();
      }
    }
  }
}
