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

PRSStreamWriter<StubStreamPolicy> prsw;

test(pout_info_corner_cases) {
  
  prsw.streamoutbufferstub = something;
  prsw.pout(0);
  assertEqual(something, prsw.streamoutbufferstub);

  prsw.streamoutbufferstub = something;
  prsw.pout(RSFULL_I);
  assertEqual(something, prsw.streamoutbufferstub);

  prsw.streamoutbufferstub = something;
  prsw.pout(RSEMPTY_I);
  assertEqual(something, prsw.streamoutbufferstub);
}

test(poutln_info_corner_cases) {
  
  prsw.streamoutbufferstub = something;
  prsw.poutln(0);
  assertEqual(something, prsw.streamoutbufferstub);

  prsw.streamoutbufferstub = something;
  prsw.poutln(RSFULL_I);
  assertEqual(something, prsw.streamoutbufferstub);

  prsw.streamoutbufferstub = something;
  prsw.poutln(RSEMPTY_I);
  assertEqual(something, prsw.streamoutbufferstub);

  prsw.streamoutbufferstub = onetwothree;
  prsw.poutln(0, RSSOMETHING_I); // not allowed to leave the first argument empty
  assertEqual(onetwothree, prsw.streamoutbufferstub);

  prsw.streamoutbufferstub = something;
  prsw.poutln(RSSOMETHING_I, RSSOMETHING_I, RSSOMETHING_I, RSONETWOTHREE_I);
  assertEqual(something, prsw.streamoutbufferstub);
}

void setup() {
  Serial.begin(9600);
  while(!Serial) {}
}

void loop() {
  Test::run();
}
