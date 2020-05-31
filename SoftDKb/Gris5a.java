/* Gris5a.java
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

class Gris5a implements IPhantom {

  public static final int NUMSERVOS = 10;
 
  private int[] _positionBuffer = new int[NUMSERVOS];
  SoftDKb _parent;
  private int _ctrlX, _ctrlY, _stateX, _stateY;
  
  public Gris5a(SoftDKb parent, int ctrlX, int ctrlY, int stateX, int stateY) {
    _parent = parent;
    _ctrlX = ctrlX;
    _ctrlY = ctrlY;
    _stateX = stateX;
    _stateY = stateY;
  }
  
  public boolean isPresentation(int model) {
    return 0 < model && model < 4;
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
    // left upper
    _parent.rect(_ctrlX +  50, _ctrlY +   0, 40, 40);
    _parent.rect(_ctrlX +   0, _ctrlY +  50, 40, 40);
    _parent.rect(_ctrlX + 100, _ctrlY +  50, 40, 40);
    _parent.rect(_ctrlX +  50, _ctrlY + 100, 40, 40);
  
    // left lower
    _parent.rect(_ctrlX +  50, _ctrlY + 200, 40, 40);
    _parent.rect(_ctrlX +   0, _ctrlY + 250, 40, 40);
    _parent.rect(_ctrlX + 100, _ctrlY + 250, 40, 40);
    _parent.rect(_ctrlX +  50, _ctrlY + 300, 40, 40);
  
    // right upper
    _parent.rect(_ctrlX + 250, _ctrlY +   0, 40, 40);
    _parent.rect(_ctrlX + 200, _ctrlY +  50, 40, 40);
    _parent.rect(_ctrlX + 300, _ctrlY +  50, 40, 40);
    _parent.rect(_ctrlX + 250, _ctrlY + 100, 40, 40);
  
    // right lower
    _parent.rect(_ctrlX + 250, _ctrlY + 200, 40, 40);
    _parent.rect(_ctrlX + 200, _ctrlY + 250, 40, 40);
    _parent.rect(_ctrlX + 300, _ctrlY + 250, 40, 40);
    _parent.rect(_ctrlX + 250, _ctrlY + 300, 40, 40);
  
    // Gating
    _parent.rect(_ctrlX + 450, _ctrlY + 100, 40, 40);
    _parent.rect(_ctrlX + 400, _ctrlY + 150, 40, 40);
    _parent.rect(_ctrlX + 500, _ctrlY + 150, 40, 40);
    _parent.rect(_ctrlX + 450, _ctrlY + 200, 40, 40);
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
    else if (mousePressedRLB(x, y)) { _parent.comPort.write(( 8<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0001 0000 0000"; }
    else if (mousePressedRLR(x, y)) { _parent.comPort.write(( 9<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0010 0000 0000"; } 
    else if (mousePressedRLL(x, y)) { _parent.comPort.write((10<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 0100 0000 0000"; }
    else if (mousePressedRLT(x, y)) { _parent.comPort.write((11<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0000 1000 0000 0000"; }    
    else if (mousePressedRUR(x, y)) { _parent.comPort.write((12<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0001 0000 0000 0000"; } 
    else if (mousePressedRUL(x, y)) { _parent.comPort.write((13<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0010 0000 0000 0000"; }
    else if (mousePressedRUT(x, y)) { _parent.comPort.write((14<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 0100 0000 0000 0000"; }
    else if (mousePressedRUB(x, y)) { _parent.comPort.write((15<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0000 0000 0000 1000 0000 0000 0000"; }  
    else if (mousePressedLLB(x, y)) { _parent.comPort.write((24<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0001 0000 0000 0000 0000 0000 0000"; }
    else if (mousePressedLLR(x, y)) { _parent.comPort.write((25<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0010 0000 0000 0000 0000 0000 0000"; } 
    else if (mousePressedLLL(x, y)) { _parent.comPort.write((26<<3) | 0x1); _parent.sendBuffer = "0x1 0000 0100 0000 0000 0000 0000 0000 0000"; }
    else if (mousePressedLLT(x, y)) { _parent.comPort.write((27<<3) | 0x1); _parent.sendBuffer = "0x1 0000 1000 0000 0000 0000 0000 0000 0000"; } 
    else if (mousePressedLUR(x, y)) { _parent.comPort.write((28<<3) | 0x1); _parent.sendBuffer = "0x1 0001 0000 0000 0000 0000 0000 0000 0000"; } 
    else if (mousePressedLUL(x, y)) { _parent.comPort.write((29<<3) | 0x1); _parent.sendBuffer = "0x1 0010 0000 0000 0000 0000 0000 0000 0000"; }
    else if (mousePressedLUT(x, y)) { _parent.comPort.write((30<<3) | 0x1); _parent.sendBuffer = "0x1 0100 0000 0000 0000 0000 0000 0000 0000"; } 
    else if (mousePressedLUB(x, y)) { _parent.comPort.write((31<<3) | 0x1); _parent.sendBuffer = "0x1 1000 0000 0000 0000 0000 0000 0000 0000"; }
  }
  
  boolean mousePressedLUT(int x, int y) { return ((x >= _ctrlX +  50) && (x <= 190) && (y >= 150) && (y <= 190)); }
  boolean mousePressedLUL(int x, int y) { return ((x >= _ctrlX +   0) && (x <= 140) && (y >= 200) && (y <= 240)); }
  boolean mousePressedLUR(int x, int y) { return ((x >= _ctrlX + 100) && (x <= 240) && (y >= 200) && (y <= 240)); }
  boolean mousePressedLUB(int x, int y) { return ((x >= _ctrlX +  50) && (x <= 190) && (y >= 250) && (y <= 290)); }

  boolean mousePressedLLT(int x, int y) { return ((x >= _ctrlX +  50) && (x <= 190) && (y >= 350) && (y <= 390)); }
  boolean mousePressedLLL(int x, int y) { return ((x >= _ctrlX +   0) && (x <= 140) && (y >= 400) && (y <= 440)); }
  boolean mousePressedLLR(int x, int y) { return ((x >= _ctrlX + 100) && (x <= 240) && (y >= 400) && (y <= 440)); }
  boolean mousePressedLLB(int x, int y) { return ((x >= _ctrlX +  50) && (x <= 190) && (y >= 450) && (y <= 490)); }

  boolean mousePressedRLT(int x, int y) { return ((x >= _ctrlX + 200) && (x <= 390) && (y >= 350) && (y <= 390)); }
  boolean mousePressedRLL(int x, int y) { return ((x >= _ctrlX + 150) && (x <= 340) && (y >= 400) && (y <= 440)); }
  boolean mousePressedRLR(int x, int y) { return ((x >= _ctrlX + 250) && (x <= 440) && (y >= 400) && (y <= 440)); }
  boolean mousePressedRLB(int x, int y) { return ((x >= _ctrlX + 200) && (x <= 390) && (y >= 450) && (y <= 490)); }

  boolean mousePressedRUT(int x, int y) { return ((x >= _ctrlX + 200) && (x <= 390) && (y >= 150) && (y <= 190)); }
  boolean mousePressedRUL(int x, int y) { return ((x >= _ctrlX + 150) && (x <= 340) && (y >= 200) && (y <= 240)); }
  boolean mousePressedRUR(int x, int y) { return ((x >= _ctrlX + 250) && (x <= 440) && (y >= 200) && (y <= 240)); }
  boolean mousePressedRUB(int x, int y) { return ((x >= _ctrlX + 200) && (x <= 390) && (y >= 250) && (y <= 290)); }

  boolean mousePressedGAT(int x, int y) { return ((x >= _ctrlX + 400) && (x <= 590) && (y >= 250) && (y <= 290)); }
  boolean mousePressedGAL(int x, int y) { return ((x >= _ctrlX + 350) && (x <= 540) && (y >= 300) && (y <= 340)); }
  boolean mousePressedGAR(int x, int y) { return ((x >= _ctrlX + 450) && (x <= 640) && (y >= 300) && (y <= 340)); }
  boolean mousePressedGAB(int x, int y) { return ((x >= _ctrlX + 400) && (x <= 590) && (y >= 350) && (y <= 390)); }

}
