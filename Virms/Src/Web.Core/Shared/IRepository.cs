// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

namespace Virms.Web.Core {

  using System;
  using System.Collections.Generic;
  using System.Linq.Expressions;

  public interface IRepository<T> {
    IEnumerable<T> GetAll();
    IEnumerable<T> Query(Expression<Func<T, bool>> filter);
    void Add(T entity);
    void Remove(T entity);
    void Update(T entity);
  }

}
