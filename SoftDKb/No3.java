/* No3.java
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

class No3 implements IPhantom {

  public static final int NUMSERVOS = 6;
 
  private int[] _positionBuffer = new int[NUMSERVOS];
  SoftDKb _parent;
  private int _ctrlX, _ctrlY, _stateX, _stateY;
  
  public No3(SoftDKb parent, int ctrlX, int ctrlY, int stateX, int stateY) {
    _parent = parent;
    _ctrlX = ctrlX;
    _ctrlY = ctrlY;
    _stateX = stateX;
    _stateY = stateY;
  }
  
  public boolean isPresentation(int model) {
    return model == 5;
  }
    
  public void setMotionState(int motor, int value) {
    if (motor >= 0 && motor < NUMSERVOS) {  
      _positionBuffer[motor] = value;
    }
  }
  
  public void clearMotionState() {
    for (int motor = 0; motor < NUMSERVOS; motor++) {  
      _positionBuffer[motor] = 0;
    }
  }
  
  public void drawMotionControls() {
    // Gating
    _parent.rect(150, 250, 40, 40);
    _parent.rect(100, 300, 40, 40);
    _parent.rect(200, 300, 40, 40);
    _parent.rect(150, 350, 40, 40);
    
    // Upper
    _parent.rect(350, 150, 40, 40);
    _parent.rect(300, 200, 40, 40);
    _parent.rect(400, 200, 40, 40);
    _parent.rect(350, 250, 40, 40);
  
    // Lower
    _parent.rect(350, 350, 40, 40);
    _parent.rect(300, 400, 40, 40);
    _parent.rect(400, 400, 40, 40);
    _parent.rect(350, 450, 40, 40);
  }
  
  public void drawMotionState() {
    for (int n=0; n<NUMSERVOS; n++) {
      _parent.text(n, _stateX, _stateY + n * 50);
      _parent.text(_positionBuffer[n], 800, 300 + n*50);
    }
  }
  
  public void onMousePressed(int x, int y) {
    // Example: (31<<3) | 0x1 = 11111 << 3 | 001 = 11111001
    if      (mousePressedGAL(x, y)) { _parent.comPort.write(( 0<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0000 0000 0001"; }
    else if (mousePressedGAT(x, y)) { _parent.comPort.write(( 1<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0000 0000 0010"; } 
    else if (mousePressedGAB(x, y)) { _parent.comPort.write(( 2<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0000 0000 0100"; }
    else if (mousePressedGAR(x, y)) { _parent.comPort.write(( 3<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0000 0000 1000"; }
    else if (mousePressedUPB(x, y)) { _parent.comPort.write(( 8<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0001 0000 0000"; }
    else if (mousePressedUPR(x, y)) { _parent.comPort.write(( 9<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0010 0000 0000"; } 
    else if (mousePressedUPL(x, y)) { _parent.comPort.write((10<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0100 0000 0000"; }
    else if (mousePressedUPT(x, y)) { _parent.comPort.write((11<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 1000 0000 0000"; }    
    else if (mousePressedLOB(x, y)) { _parent.comPort.write((24<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0001 0000 0000 0000 0000 0000 0000"; }
    else if (mousePressedLOR(x, y)) { _parent.comPort.write((25<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0010 0000 0000 0000 0000 0000 0000"; } 
    else if (mousePressedLOL(x, y)) { _parent.comPort.write((26<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0100 0000 0000 0000 0000 0000 0000"; }
    else if (mousePressedLOT(x, y)) { _parent.comPort.write((27<<3) | 0x1); _parent.sendBuffer = "0x1 0000 1000 0000 0000 0000 0000 0000 0000"; } 
  }
  
  boolean mousePressedGAT(int x, int y) { return ((x >= 150) && (x <= 190) && (y >= 250) && (y <= 290)); }
  boolean mousePressedGAL(int x, int y) { return ((x >= 100) && (x <= 140) && (y >= 300) && (y <= 340)); }
  boolean mousePressedGAR(int x, int y) { return ((x >= 200) && (x <= 240) && (y >= 300) && (y <= 340)); }
  boolean mousePressedGAB(int x, int y) { return ((x >= 150) && (x <= 190) && (y >= 350) && (y <= 390)); }
  
  boolean mousePressedUPT(int x, int y) { return ((x >= 350) && (x <= 390) && (y >= 350) && (y <= 390)); }
  boolean mousePressedUPL(int x, int y) { return ((x >= 300) && (x <= 340) && (y >= 400) && (y <= 440)); }
  boolean mousePressedUPR(int x, int y) { return ((x >= 400) && (x <= 440) && (y >= 400) && (y <= 440)); }
  boolean mousePressedUPB(int x, int y) { return ((x >= 350) && (x <= 390) && (y >= 450) && (y <= 490)); }

  boolean mousePressedLOT(int x, int y) { return ((x >= 350) && (x <= 390) && (y >= 150) && (y <= 190)); }
  boolean mousePressedLOL(int x, int y) { return ((x >= 300) && (x <= 340) && (y >= 200) && (y <= 240)); }
  boolean mousePressedLOR(int x, int y) { return ((x >= 400) && (x <= 440) && (y >= 200) && (y <= 240)); }
  boolean mousePressedLOB(int x, int y) { return ((x >= 350) && (x <= 390) && (y >= 250) && (y <= 290)); }

}
