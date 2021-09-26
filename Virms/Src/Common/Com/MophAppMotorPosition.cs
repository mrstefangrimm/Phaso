/* MotionSystemMotorPosition.cs - ViphApp (C) motion phantom application.
 * Copyright (C) 2019-2021 by Stefan Grimm
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with the ViphApp software.  If not, see
 * <http://www.gnu.org/licenses/>.
 */


namespace ViphApp.Common.Com {
  public class MophAppMotorPosition {
    public byte Channel;
    public ushort Value;
    public ushort StepSize;
  }
}
