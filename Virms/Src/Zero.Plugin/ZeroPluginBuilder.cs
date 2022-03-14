﻿namespace Virms.Zero {
  using System;
  using System.Windows;
  using System.Windows.Markup;
  using Virms.Common;
  using Virms.Common.Plugin;
  using Virms.Zero.UI;
  using Virms.Zero.UI.Views;

  public class ZeroPluginBuilder : IPluginBuilder {

    public IPluginPhantom BuildPluginPhantom(IMophAppProxy mophApp) {
      return new PluginPhantom("Zero Phantom", new ZeroPhantomViewModel(), new ZeroControlViewModel(mophApp));
    }

    public DataTemplate BuildPhantomTemplate() {
      return CreateTemplate(typeof(ZeroPhantomViewModel), typeof(ZeroPhantomView));
    }

    public DataTemplate BuildControlTemplate() {
      return CreateTemplate(typeof(ZeroControlViewModel), typeof(ZeroControlView));
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
