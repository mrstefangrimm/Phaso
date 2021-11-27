// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.EntityFrameworkCore;

namespace Virms.Web {

  public class MotionSystemConfigContext : DbContext {
    public MotionSystemConfigContext(DbContextOptions options)
    : base(options) {
    }

    public DbSet<MotionSystemConfig> Config { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
      => options.UseSqlite("Data Source=msconfig.db");
  }
}
