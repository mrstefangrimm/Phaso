// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

namespace Virms.Web.Core {
  public class Entity<TDATA>  where TDATA : class, new() {
    public long Id { get; set; }
    public TDATA Data { get; } = new TDATA();
  }
}
