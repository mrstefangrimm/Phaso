REM http://savannah.nongnu.org/projects/avrdude/
REM http://download.savannah.gnu.org/releases/avrdude/avrdude-6.3-mingw32.zip

avrdude -p atmega328p -c arduino -P %1 -b 115200 -D -v -C avrdude.conf -U flash:w:mophapp_m%2.hex:i
