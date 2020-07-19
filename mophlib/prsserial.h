/* prsserial.h - functions to add string resources to the program memory and 
 * write program memory resources to the serial output buffer. 
 * Copyright (C) 2020 by Stefan Grimm
 *
 * This Library is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This Library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with the mophlib Library.  If not, see <http://www.gnu.org/licenses/>. */

#ifndef _PRSSERIAL_H
#define _PRSSERIAL_H

/** Defines a resource string (RS) that is stored in the program memory and has the character of a message output.
  *  Usage: PRSDEFM(RSHELLOWORLD, "Hello World"); 
  *
  * To disable message output, use this definition in your code: #define PRSDEFM(N, V) const char* N = 0 */
#define PRSDEFM(N, V) const char N[] PROGMEM = V

/** Defines a resource string (RS) that is stored in the program memory and has the character of a information output.
  *  Usage: PRSDEFI(RSHELLOWORLD, "hello world"); 
  *
  * To disable information output, use this definition in your code: #define PRSDEFI(N, V) const char* N = 0 */
#define PRSDEFI(N, V) const char N[] PROGMEM = V

/** The maximal lenght for the whole serial output.
  * If exceeded, the application will crash! */
#define SPOUTMAXSERIALOUTPUTLENTH 30

template<typename TStreamPolicy>
class PRSStreamWriter : public TStreamPolicy {
public:
  /** Writes the given resource string to the serial output buffer.
    * Usage: prsw.pout(RSHELLOWORLD) */
  void pout(const char* rs) {
    if (rs) strcpy_P(_buf, rs); else return;
    TStreamPolicy::out(_buf);
  }
  /** Writes the given resource string to the serial output buffer.
    * Usage: prsw.poutln(RSHELLOWORLD) */
  void poutln(const char* rs1, const char* rs2 = 0, const char* rs3 = 0, const char* rs4 = 0) {
    if (rs1) strcpy_P(_buf, rs1); else return;
    if (rs2) strcat_P(_buf, rs2);
    if (rs3) strcat_P(_buf, rs3);
    if (rs4) strcat_P(_buf, rs4);
    TStreamPolicy::outln(_buf);
  }
private:
  char _buf[SPOUTMAXSERIALOUTPUTLENTH + 1];
};

struct SerialPrintPolicy {
  void out(const char* ch) { Serial.print(ch);  }
  void outln(const char* ch) { Serial.println(ch); }

  void outln(const float& number, uint8_t digits) { Serial.println(number, digits); }
  template<typename T> void out(const T& val) { Serial.print(val);  }
  template<typename T> void outln(const T& val) { Serial.println(val);  }
  template<typename T> void out(const T& val, int base) { Serial.print(val, base);  }
};

#endif
