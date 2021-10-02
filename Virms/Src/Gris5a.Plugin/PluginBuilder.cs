// Copyright (c) 2020-2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using System;
using System.Windows;
using System.Windows.Markup;
using Virms.Common.Com;
using Virms.Common.Plugin;
using Virms.Gris5a.UI;
using Virms.Gris5a.UI.Views;

namespace Virms.Gris5a {

  public class PluginBuilder : IPluginBuilder {

    public IPluginPhantom BuildPluginPhantom(MophAppProxy mophApp) {
      return new PluginPhantom("Marker Phantom", new Gris5aPhantomViewModel(), new Gris5aControlViewModel(mophApp));
    }

    public DataTemplate BuildPhantomTemplate() {
      return CreateTemplate(typeof(Gris5aPhantomViewModel), typeof(Gris5aPhantomView));
    }

    public DataTemplate BuildControlTemplate() {
      return CreateTemplate(typeof(Gris5aControlViewModel), typeof(Gris5aControlView));
    }

    private DataTemplate CreateTemplate(Type viewModelType, Type viewType) {

      // https://www.ikriv.com/dev/wpf/DataTemplateCreation/
      // https://www.ikriv.com/dev/wpf/DataTemplateCreation/DataTemplateManager.cs
      //var manager = new DataTemplateManager();
      //manager.RegisterDataTemplate<ViewModelA, ViewA>();
      //manager.RegisterDataTemplate<ViewModelB, ViewB>();

      var xaml = $"<DataTemplate DataType=\"{{x:Type vm:{viewModelType.Name}}}\"><v:{viewType.Name} /></DataTemplate>";

      var context = new ParserContext();

      context.XamlTypeMapper = new XamlTypeMapper(new string[0]);
      context.XamlTypeMapper.AddMappingProcessingInstruction("vm", viewModelType.Namespace, viewModelType.Assembly.FullName);
      context.XamlTypeMapper.AddMappingProcessingInstruction("v", viewType.Namespace, viewType.Assembly.FullName);

      context.XmlnsDictionary.Add("", "http://schemas.microsoft.com/winfx/2006/xaml/presentation");
      context.XmlnsDictionary.Add("x", "http://schemas.microsoft.com/winfx/2006/xaml");
      context.XmlnsDictionary.Add("vm", "vm");
      context.XmlnsDictionary.Add("v", "v");

      var template = (DataTemplate)XamlReader.Parse(xaml, context);
      return template;
    }

  }
}
