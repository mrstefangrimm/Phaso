# Phantom Software Suite
The Phantom software (Phaso) currently supports the following phantoms:
 - Marker Motion X-Ray Imaging Phantom (working title: GRIS5A)
 - Liver Deformation X-Ray Imaging Phantom (working title: No2) 
 - Lung Motion X-Ray Imaging Phantom (working title: No3) 

## Device Software
All the phantoms come with an Arduino Uno micro controller and an Adafruit Servo Shield. This software runs on the Arduino:
 - mophapp
 - mophlib

## Client Software
The client is connected to the device through a USB cable. Only one client at a time is supported. The protocol is open and described in the Wiki.
Currently the following clients exist:
 - SoftKBb
 - Virms.NET
 - MophDroid

## Software Toolchain

| Application | License |
| ----------- | ------- |
| mophapp     | GPL     |
| MophDroid   | LGPL    |
| SoftDKb     | LGPL    |
| ViphApp     | LGPL    |

| Tool             | License           |
| ---------------- | ----------------- |
| Arduino IDE      | GPL               |
| avrdude          | GPL               |
| QM               | GPL               |
| Processing       | GPL               |
| gcc              | GPL               |
| VS2019 community | Microsoft license |
| Android Studio   | Google license    |

Libraries

| Library         | Licence           |
| --------------- | ----------------- |
| prfServo        | LGPL              |
| mophlib         | LGPL, BSD         |
| Arduino.h       | LGPL              |
| qpn.h           | GPL               |
| Processing Core | LPGL              |
| .NET 4.6.2      | Microsoft license |
| Helix toolkit   | MIT               |
| Android SDK     | Google license    |

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.