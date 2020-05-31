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
