#ifndef _PRSSERIALTESTDEFINITION_H
#define _PRSSERIALTESTDEFINITION_H

/* Unit test shared test definitions for the mophlib Arduino library

Written by Stefan Grimm, 2020.
Released into the public domain.
*/

// test strings in RAM
const char* something = "something";
const char* empty = "";
const char* full = "123456789012345678901234567890";
const char* onetwothree = "123";

// test resource strings in PROGMEM
PRSDEFI(RSSOMETHING_I, "something");
PRSDEFI(RSEMPTY_I, "");
PRSDEFI(RSFULL_I, "123456789012345678901234567890");
PRSDEFI(RSONETWOTHREE_I, "123");

PRSDEFM(RSSOMETHING_M, "something");
PRSDEFM(RSEMPTY_M, "");
PRSDEFM(RSFULL_M, "123456789012345678901234567890");
PRSDEFM(RSONETWOTHREE_M, "123");

const char* SerialPrintBufferStub;
void TestSerialPrint(const char* ch) {
  SerialPrintBufferStub = ch;
}
void TestSerialPrintLn(const char* ch) {
  SerialPrintBufferStub = ch;
}

#endif