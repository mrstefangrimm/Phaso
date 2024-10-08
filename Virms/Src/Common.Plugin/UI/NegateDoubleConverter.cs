﻿// Written 2018-2021 by Stefan Grimm. Released into the public domain.
using System;
using System.Globalization;
using System.Windows.Data;

namespace Virms.Common.UI {

  public class NegateDoubleConverter : IValueConverter {
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture) {
      return -(double)value;
    }
    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) {
      return -(double)value;
    }
  }
}
