// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  public interface IMotionSystemBuilder {
    IMotionSystem BuildMotionSystem(IMophAppProxy mophApp);
  }
}
