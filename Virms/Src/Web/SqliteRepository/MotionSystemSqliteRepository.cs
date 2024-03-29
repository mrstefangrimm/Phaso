﻿// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web {
  using Microsoft.EntityFrameworkCore;
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Linq.Expressions;
  using Virms.Common;
  using Virms.Web.Core;
  using Virms.Web.ResourceAccess;
  using MotionSystem = Core.MotionSystem;

  public class MotionSystemSqliteRepository : IRepository<MotionSystem>, IIdCreator {

    private IList<MotionSystem> _entities;
    private static long _counter;

    public MotionSystemSqliteRepository(
      IMophAppProxyFactory proxyFactory,
      bool isDevelopment) {
      _entities = new List<MotionSystem>(3);

      string pluginPath = Environment.CurrentDirectory;

      if (isDevelopment) {
#if DEBUG
        pluginPath = Environment.CurrentDirectory + @"\bin\Debug\net5.0";
#else
        pluginPath = Environment.CurrentDirectory + @"\bin\Release\net5.0";
#endif
      }

      var pluginFactory = new InstanceFactory();
      var gris5aPluginBuilder = pluginFactory.Create<IMotionSystemBuilder>($@"{pluginPath}\Virms.Gris5a.dll");
      var no2PluginBuilder = pluginFactory.Create<IMotionSystemBuilder>($@"{pluginPath}\Virms.No2.dll");
      var no3PluginBuilder = pluginFactory.Create<IMotionSystemBuilder>($@"{pluginPath}\Virms.No3.dll");

      var gris5aConnection = new DeviceComPortService(proxyFactory.Create());
      var no2Connection = new DeviceComPortService(proxyFactory.Create());
      var no3Connection = new DeviceComPortService(proxyFactory.Create());

      var marker = new MotionSystemBuilder().Create(gris5aPluginBuilder, this, gris5aConnection);
      var liver = new MotionSystemBuilder().Create(no2PluginBuilder, this, no2Connection);
      var lung = new MotionSystemBuilder().Create(no3PluginBuilder, this, no3Connection);

      //var dbOptBuilder = new DbContextOptionsBuilder();
      //var dbOptBuilderSqlite = dbOptBuilder.UseSqlite("DefaultConnection");
      //var dbOptions = dbOptBuilderSqlite.Options;
      var dbContextOptions = new DbContextOptions<MotionSystemConfigContext>();
      using var dbContext = new MotionSystemConfigContext(dbContextOptions);
      var comPorts = dbContext.Config.ToList();
      var markerConfig = comPorts.Where(x => string.Compare(x.Alias, marker.Data.Alias, true) == 0).FirstOrDefault();
      if (markerConfig != null) {
        marker.Data.ComPort = markerConfig.ComPort;
      }
      var liverConfig = comPorts.Where(x => string.Compare(x.Alias, liver.Data.Alias, true) == 0).FirstOrDefault();
      if (liverConfig != null) {
        liver.Data.ComPort = liverConfig.ComPort;
      }
      var lungConfig = comPorts.Where(x => string.Compare(x.Alias, lung.Data.Alias, true) == 0).FirstOrDefault();
      if (lungConfig != null) {
        lung.Data.ComPort = lungConfig.ComPort;
      }

      _entities.Add(marker);
      _entities.Add(liver);
      _entities.Add(lung);
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
      var dbContextOptions = new DbContextOptions<MotionSystemConfigContext>();
      using var dbContext = new MotionSystemConfigContext(dbContextOptions);

      var dbo = dbContext.Config.Where(x => x.Alias == entity.Data.Alias).FirstOrDefault();
      if (dbo != null) {
        using var dbContextTransaction = dbContext.Database.BeginTransaction();
        dbo.ComPort = entity.Data.ComPort;
        dbContext.Entry(dbo).State = EntityState.Modified;

        dbContext.SaveChanges();
        dbContextTransaction.Commit();
      }
    }
    
    public long CreateId() { return ++_counter; }

  }

}
