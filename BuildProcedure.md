# Phaso Software Build Procedure

The build steps can be executed in arbitrary order.

## 0. Preparation

Required software:

- avrdude 6.3 from http://savannah.nongnu.org/projects/avrdude/

- Arduino IDE
- Installed qm_4.4.0-win32.exe, qpn-6.4.0_arduino-1.8.x.exe

- Microsoft Visual Studio 2019

- processing from https://processing.org/

- Android Studio

Create a package folder

## 1. Build mophapp

1. Copy '\Phaso\mophlib' to the Arduino libraries folder
2. In QM, open mophapp.qm from '\Phaso\mophapp\src\mophapp'
3. In QM, Tools, External Tools, update 'BOARD_COM' to the correct COM port
4. In QM, Tools, External Tools, Arguments, set the 'MODELTYPE=' to '1'
5. Press 'Save'
6. In QM, run 'clean' and 'build'
7. Copy the file 'mophapp.hex' from '\Phaso\mophapp\src\mophapp\bin' the package folder and rename it to 'mophapp_m1.hex'
8. Repeat steps 3 to 6 for the model types 2, 3, 4 and 5

## 2. Build Virms Desktop Application

1. In Visual Studio, open 'Virms.App.sln' from '\Phaso\Virms\Src'
2. Set 'App' as startup project
3. Right-click the 'App' project an press 'Publish...'
4. Press 'Publish'
5. Copy the 'publish' folder to the package folder and rename it to Virms.App
6. Delete the '*.pdb' files

## 3. Build Virms Web Service

1. In Visual Studio, open 'Virms.Web.sln' from '\Phaso\Virms\Src'
2. Set 'Web' as startup project
3. Right-click the 'Web' project an press 'Publish...'
4. Press 'Publish'
5. Copy the 'publish' folder to the package folder and rename it to Virms.Web
6. Delete the '*.pdb' files
7. Copy the file "msconfig.db" from '\Phaso\Virms\Src\Web' to the package folder

## 4. Build Virms Live Image Producer

1. In Visual Studio, open 'Virms.LiveImageProducer' from '\Phaso\Virms\Src'
2. Right-click the 'LiveImageProducer' project an press 'Publish...'
3. Press 'Publish'
4. Copy the 'publish' folder to the package folder and rename it to Virms.LiveImageProducer
5. Delete the '*.pdb' files

## 4. Build SoftDKb

1. In processing, open 'SoftDKb.pde' from '\Phaso\SoftDKb'
2. Go to File, Export Application...
3. Include 'Embed Java'
4. Press 'Export'
5. Copy the 'application.windows64' folder from '\Phaso\SoftDKb' to to the package folder and rename it to 'SoftDKb'
6. Delete the folder 'source'

## 5. Build MophDroid

1. In Android Studio, open '\Phaso\MophDroid'
2. Set Build Variants (left fly-in) to 'debug'
3. Go to Build, Build Bundle(s)/APK(s), Build APK(s)
4. Copy 'debug' from '\Phaso\MophDroid\mophdroid\build\outputs\apk' to the package folder and rename it to 'MophDroid'

## 6. Copy avrdude binaries

Copy  from the avrdude download the following files to the package folder:

- avrdude.conf
- avrdude.exe
- libusb0.dll

## 7. Copy scripts

Copy from '\Phaso\mophapp\scripts' the following files to the package folder:

- setup.ps1
- upload_arduinosoftware.bat
- calibrate_m1.ps1
- calibrate_m2.ps1
- calibrate_m3.ps1
- calibrate_m4.ps1
- calibrate_m5.ps1

