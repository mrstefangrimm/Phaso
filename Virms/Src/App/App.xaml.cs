/* App.xaml.cs - ViphApp (C) motion phantom application.
 * Copyright (C) 2019-2020 by Stefan Grimm
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with the ViphApp software.  If not, see
 * <http://www.gnu.org/licenses/>.
 */

using System;
using System.Collections.ObjectModel;
using System.Threading;
using System.Windows;
using ViphApp.App.Plugin;
using ViphApp.Common.Plugin;

namespace ViphApp.App {

  public partial class App : Application {  

    private CancellationTokenSource _cancellationTokenSource;
    private Common.Com.MophAppProxy _mophApp;

    protected override void OnStartup(StartupEventArgs e) {
      base.OnStartup(e);

      _cancellationTokenSource = new CancellationTokenSource();

      _mophApp = new Common.Com.MophAppProxy();

      var pluginFactory = new PluginFactory();

      string pluginPath = Environment.CurrentDirectory;
      
      var gris5aPluginBulder= pluginFactory.CreatePluginBuilder(string.Format(@"{0}\ViphApp.Gris5a.dll", pluginPath));
      var no2PluginBulder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\ViphApp.No2.dll", pluginPath));
      var no3PluginBulder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\ViphApp.No3.dll", pluginPath));

      ObservableCollection<IPluginPhantom> availablePhantoms = new ObservableCollection<IPluginPhantom>() {
        gris5aPluginBulder.BuildPluginPhantom(_mophApp),
        no2PluginBulder.BuildPluginPhantom(_mophApp),
        no3PluginBulder.BuildPluginPhantom(_mophApp)};

      var mainViewModel = new UI.MainViewModel(_mophApp, availablePhantoms);

      var app = new UI.Views.MainWindow();
      app.DataContext = mainViewModel;

      var templ = gris5aPluginBulder.BuildPhantomTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = gris5aPluginBulder.BuildControlTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no2PluginBulder.BuildPhantomTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no2PluginBulder.BuildControlTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no3PluginBulder.BuildPhantomTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      templ = no3PluginBulder.BuildControlTemplate();
      app.Resources.Add(templ.DataTemplateKey, templ);
      app.Closing += mainViewModel.OnClosing;
      app.Show();
    }

    protected override void OnExit(ExitEventArgs e) {
      base.OnExit(e);
      _cancellationTokenSource.Cancel();
      _mophApp.Dispose();
    }
  }
}
