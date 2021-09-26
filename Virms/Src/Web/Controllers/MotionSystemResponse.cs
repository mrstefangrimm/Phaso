// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

using Collares;
using Virms.Web.Core;

namespace Virms.Web {
  using MotionPatternsResponse = WebApiCollectionResponse<MotionPatternResponse, MotionPatternData>;

  public class MotionSystemResponse : WebApiResourceResponse<MotionSystemData> {
    public MotionPatternsResponse MotionPatterns { get; } = new MotionPatternsResponse();
  }
}
