/* None.java
 * Copyright (C) 2020 by Stefan Grimm
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
 * along with the software.  If not, see http://www.gnu.org/licenses/.
 */
 
 import processing.serial.*;
 
class None implements IPhantom {
  
  SoftDKb _parent;
  private int _ctrlX, _ctrlY, _stateX, _stateY;
  
  public None(SoftDKb parent, int ctrlX, int ctrlY, int stateX, int stateY) {
    _parent = parent;
    _ctrlX = ctrlX;
    _ctrlY = ctrlY;
    _stateX = stateX;
    _stateY = stateY;
  }
  
  public boolean isPresentation(int model) {
    return model == 0; //<>//
  }
  
  public void setMotionState(int motor, int value) {
  }
  
  public void clearMotionState() {
  }
  
  public void drawMotionControls() {
    _parent.text("Loading...", _ctrlX + 150, _ctrlY + 200);
  }
  
  public void drawMotionState() {
  }
  
  public void onMousePressed(int x, int y) {
  }  

}
