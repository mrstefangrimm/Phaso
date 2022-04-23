// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {
  public static class MathEx {

    public static double Sin4(double value) {
      return System.Math.Pow(System.Math.Sin(value), 4);
    }

    public static double Cos4(double value) {
      return System.Math.Pow(System.Math.Cos(value), 4);
    }
  }
}
