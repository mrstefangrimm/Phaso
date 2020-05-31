/*
Unit tests for the mophlib Arduino library

Written by Stefan Grimm, 2020.
Released into the public domain.
*/

#line 9 "basic.ino"
#include <ArduinoUnit.h>
#include "prsserial.h"

#define PRSDEFI(N, V) const char* N = 0
#include "prsserialtestdefiniton.h"

test(spout_info_corner_cases) {
  fpSerialPrint = &TestSerialPrint;
  
  SerialPrintBufferStub = something;
  spout(0);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spout(RSFULL_I);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spout(RSEMPTY_I);
  assertEqual(something, SerialPrintBufferStub);
}

test(spoutln_info_corner_cases) {
  fpSerialPrintLn = &TestSerialPrintLn;
  
  SerialPrintBufferStub = something;
  spoutln(0);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spoutln(RSFULL_I);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spoutln(RSEMPTY_I);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = onetwothree;
  spoutln(0, RSSOMETHING_I); // not allowed to leave the first argument empty
  assertEqual(onetwothree, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spoutln(RSSOMETHING_I, RSSOMETHING_I, RSSOMETHING_I, RSONETWOTHREE_I);
  assertEqual(something, SerialPrintBufferStub);
}

void setup() {
  Serial.begin(9600);
  while(!Serial) {}
}

void loop() {
  Test::run();
}
