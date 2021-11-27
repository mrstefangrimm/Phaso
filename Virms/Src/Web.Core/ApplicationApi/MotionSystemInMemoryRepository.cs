// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

namespace Virms.Web.Core {

  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Linq.Expressions;
  using Virms.Web.ResourceAccess;

  public class MotionSystemInMemoryRepository : IRepository<MotionSystem>, IIdCreator {

    private IList<MotionSystem> _entities;
    private static long _counter;

    public MotionSystemInMemoryRepository(bool isDevelopment) {
      _entities = new List<MotionSystem>(3);

      string pluginPath = Environment.CurrentDirectory;

      if (isDevelopment) {
#if DEBUG
        pluginPath = Environment.CurrentDirectory + @"\bin\Debug\net5.0";
#else
        pluginPath = Environment.CurrentDirectory + @"\bin\Release\net5.0";
#endif
      }

      var pluginFactory = new WebPluginFactory();
      var gris5aPluginBulder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\Virms.Gris5a.dll", pluginPath));
      var no2PluginBulder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\Virms.No2.dll", pluginPath));
      var no3PluginBulder = pluginFactory.CreatePluginBuilder(string.Format(@"{0}\Virms.No3.dll", pluginPath));

      var gris5aConnection = new DeviceComPortService();
      var no2Connection = new DeviceComPortService();
      var no3Connection = new DeviceComPortService();

      _entities.Add(new MotionSystemBuilder().Create(gris5aPluginBulder, this, gris5aConnection));
      _entities.Add(new MotionSystemBuilder().Create(no2PluginBulder, this, no2Connection));
      _entities.Add(new MotionSystemBuilder().Create(no3PluginBulder, this, no3Connection));
    }


    public IEnumerable<MotionSystem> GetAll() {
      return _entities;
    }

    public IEnumerable<MotionSystem> Query(Expression<Func<MotionSystem, bool>> filter) {
      return _entities.Where(filter.Compile());
    }

    public void Add(MotionSystem entity) {
      throw new NotImplementedException();
    }

    public void Remove(MotionSystem entity) {
      throw new NotImplementedException();
    }

    public void Update(MotionSystem entity) {
    }

    public long CreateId() { return ++_counter; }

  }
}
