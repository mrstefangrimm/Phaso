/*
Unit tests for the mophlib Arduino library

Written by Stefan Grimm, 2020.
Released into the public domain.
*/

#line 9 "basic.ino"
#include <ArduinoUnit.h>
#include "prsserial.h"
#include "prsserialtestdefiniton.h"

test(spout_info_corner_cases) {
  fpSerialPrint = &TestSerialPrint;
  
  SerialPrintBufferStub = something;
  spout(0);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = empty;
  spout(RSFULL_I);
  assertEqual(full, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spout(RSEMPTY_I);
  assertEqual(empty, SerialPrintBufferStub);
}

test(spoutln_info_corner_cases) {
  fpSerialPrintLn = &TestSerialPrintLn;
  
  SerialPrintBufferStub = something;
  spoutln(0);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = empty;
  spoutln(RSFULL_I);
  assertEqual(full, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spoutln(RSEMPTY_I);
  assertEqual(empty, SerialPrintBufferStub);

  SerialPrintBufferStub = onetwothree;
  spoutln(0, RSSOMETHING_I); // not allowed to leave the first argument empty
  assertEqual(onetwothree, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spoutln(RSSOMETHING_I, RSSOMETHING_I, RSSOMETHING_I, RSONETWOTHREE_I);
  assertEqual("somethingsomethingsomething123", SerialPrintBufferStub);
}
  
test(spout_message_corner_cases) {
  fpSerialPrint = &TestSerialPrint;
  
  SerialPrintBufferStub = something;
  spout(0);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = empty;
  spout(RSFULL_M);
  assertEqual(full, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spout(RSEMPTY_M);
  assertEqual(empty, SerialPrintBufferStub);
}

test(spoutln_message_corner_cases) {
  fpSerialPrintLn = &TestSerialPrintLn;
  
  SerialPrintBufferStub = something;
  spoutln(0);
  assertEqual(something, SerialPrintBufferStub);

  SerialPrintBufferStub = empty;
  spoutln(RSFULL_M);
  assertEqual(full, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spoutln(RSEMPTY_M);
  assertEqual(empty, SerialPrintBufferStub);

  SerialPrintBufferStub = onetwothree;
  spoutln(0, RSSOMETHING_M); // not allowed to leave the first argument empty
  assertEqual(onetwothree, SerialPrintBufferStub);

  SerialPrintBufferStub = something;
  spoutln(RSONETWOTHREE_M, RSSOMETHING_M, RSSOMETHING_M, RSSOMETHING_M);
  assertEqual("123somethingsomethingsomething", SerialPrintBufferStub);
}

void setup() {
  Serial.begin(9600);
  while(!Serial) {}
}

void loop() {
  Test::run();
}
