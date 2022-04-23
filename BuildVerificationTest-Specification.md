# Phaso Build Verification Test Specification

The tests can be executed in arbitrary order.

## 0. Preparation

Required software:

- PowerShell
- SoftDKb
- Virms.App
- Virms.Web
- MophDroid installed on an Android device
- LiveImageProducer
- Extracted the source code in \Phaso\Virms\Src\Web
- Existing certificate (crt.pem and key.pem files) and appsettings.json update with the existing certificate files

Required phantoms:

- Marker phantom
- Liver phantom
- Lung phantom

## 1. Test Marker Phantom ModelType1

1. Connect the PC to the Marker phantom
1. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
1. Enter the correct COM port, e.g. 'COM4'
1. Enter as phantom model '1'
1. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
1. Confirm the EEPROM update with 'y'
1. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Marker m1' can be found
   - In the PowerShell, the last line is 'Complete'
1. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '1'
   - The software is in state 'Remote' (red bulb)
1. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
1. Test all the axes and check that the phantom moves the correct axis in the right direction
1. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
1. Start preset '4'
   - The phantom moves the longitudinal axes  in a sine^4 curve
1. Press 'R'
   - The motion phantom stops
1. Close the SoftDKb
1. End of the test

## 2. Test Marker Phantom ModelType2

16. Connect the PC to the Marker phantom
1. 2. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
1. Enter the correct COM port, e.g. 'COM4'
1. Enter as phantom model '2'
1. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
1. Confirm the EEPROM update with 'y'
1. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Marker m2' can be found
   - In the PowerShell, the last line is 'Complete'
1. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '2'
   - The software is in state 'Remote' (red bulb)
1. Press 'M'
   
   - The software is in state 'Manual Motion' (green bulb)
1. Test all the axes and check that the phantom moves the correct axis in the right direction
1. Press 'P'
   
   - The software is in state 'Preset Motion' (blue bulb)
1. Start preset '4'
   
   - The phantom moves the longitudinal axes  in a sine^4 curve
1. Press 'R'
   
   - The motion phantom stops
1. Close the SoftDKb
1. Start the application '\Virms.App\Virms.App.exe'
   
   - The marker phantom is displayed
1. Select the COM port and press 'Connect'
   
   - The connect button changes to 'Disconnect'
1. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
1. On the right fly-in, press 'Automatic', select 'Free-breath Gating, Pos 1-2' and press 'Run'
   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. Press 'Disconnect' and close the application
   
   - The phantom stops moving and the application closes
1. Start MophDroid on your Android device
1. In the Service menu, select 'Marker Motion Phantom'
1. Connect the Android device to the phantom
   
   - The status is 'Synced'
1. In the Service Menu, select 'Marker phantom'
1. Select 'MANUAL'
1. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
1. Select 'PRESET', select 'Preset 4' and press 'Start'
   
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. Press 'Stop'
   
   - The phantom stops moving
1. Close MophDroid and disconnect the Android device.
1. Open a shell in \Phaso\Virms\Src\Web
1. dotnet run --environment "Development" Web.csproj
1. Open "http://localhost:5000/" in a Web browser and select 'Marker Phantom'
   
   - The button 'Take control' is visible
1. Press 'Take control'
   
   - Upper, Lower and Gating actuators move when moving the sliders
1. Select 'Automatic', the motion pattern 'Free-breath Gating, Pos 1-2' and press 'Start'
   - All actuators move
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. End of the test

## 3. Test Marker Phantom ModelType3

50. Connect the PC to the Marker phantom
1. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
1. Enter the correct COM port, e.g. 'COM4'
1. Enter as phantom model '3'
1. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
1. Confirm the EEPROM update with 'y'
1. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Marker m3' can be found
   - In the PowerShell, the last line is 'Complete'
1. On the DKb, the green LED is lit
1. Test all the axes and check that the phantom moves the correct axis in the right direction
1. Press on the Remote mode button
   -  The red LED is lit
1. Press on the Preset mode button
   - The blue LED is lit
1. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '3'
   - The software is in state 'Manual' (green bulb)
1. Test all the axes and check that the phantom moves the correct axis in the right direction
1. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
1. Start preset '4'
   - The phantom moves the longitudinal axes  in a sine^4 curve
1. Press 'R'
   - The motion phantom stops
1. Close the SoftDKb
1. End of the test

## 4. Test Liver Phantom ModelType4

68. Connect the PC to the Liver phantom
1. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
1. Enter the correct COM port, e.g. 'COM4'
1. Enter as phantom model '4'
1. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
1. Confirm the EEPROM update with 'y'
1. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Liver m4' can be found
   - In the PowerShell, the last line is 'Complete'
1. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '4'
   - The software is in state 'Remote' (red bulb)
1. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
1. Test all the axes and check that the phantom moves the correct axis in the right direction
1. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
1. Start preset '4'
   - The phantom moves the longitudinal axes  in a sine^4 curve
1. Press 'R'
   - The motion phantom stops 
1. Close the SoftDKb
1. Start the application '\Virms.App\Virms.App.exe', select 'Liver Phantom' on the left panel
   - The liver phantom is displayed
1. Select the COM port and press 'Connect'
   - The connect button changes to 'Disconnect'
1. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
1. On the right fly-in, press 'Automatic', select 'Free-breath Gating, Pos 1-2' and press 'Run'
   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. Press 'Disconnect' and close the application
   - The phantom stops moving and the application closes
1. Start MophDroid on your Android device
1. In the Service menu, select 'Liver Motion Phantom'
1. Connect the Android device to the phantom
   - The status is 'Synced'
1. In the Service Menu, select 'Liver Deformation Phantom'
1. Select 'MANUAL'
1. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
1. Select 'PRESET', select 'Preset 4' and press 'Start'
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. Press 'Stop'
   - The phantom stops moving
1. Close MophDroid and disconnect the Android device
1. Open a shell in \Phaso\Virms\Src\Web
1. dotnet run --environment "Development" Web.csproj
1. Open "http://localhost:5000/" in a Web browser and select 'Lung Phantom'
   - The button 'Take control' is visible
1. Press 'Take control'
   - Upper, Lower and Gating actuators move when moving the sliders
1. Select 'Automatic', the motion pattern 'Free-breath Gating, Pos 1-2' and press 'Start'
   - All actuators move
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. End of the test

## 5. Test Lung  Phantom ModelType5

102. Connect the PC to the Lung phantom
1. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
1. Enter the correct COM port, e.g. 'COM4'
1. Enter as phantom model '5'
1. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
1. Confirm the EEPROM update with 'y'
1. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Lung m5' can be found
   - In the PowerShell, the last line is 'Complete'
1. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '5'
   - The software is in state 'Remote' (red bulb)
1. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
1. Test all the axes and check that the phantom moves the correct axis in the right direction
1. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
1. Start preset '4'
   - The phantom moves the longitudinal axes  in a sine^4 curve
1. Press 'R'
   - The motion phantom stops
1. Close the SoftDKb
1. Start the application '\Virms.App\Virms.App.exe', select 'Lung Phantom' on the left panel
   - The lung phantom is displayed
1. Select the COM port and press 'Connect'
   - The connect button changes to 'Disconnect'
1. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
1. On the right fly-in, press 'Automatic', select 'Free-breath Gating, Pos 1-2' and press 'Start' and press 'Run'
   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. Press 'Disconnect' and close the application
   - The phantom stops moving and the application closes
1. Start MophDroid on your Android device
1. In the Service menu, select 'Lung Motion Phantom'
1. Connect the Android device to the phantom
   - The status is 'Synced'
1. Select 'MANUAL'
1. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
1. Select 'PRESET', select 'Preset 4' and press 'Start'
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. Press 'Stop'
   - The phantom stops moving
1. Close MophDroid and disconnect the Android device
1. Connect the PC to the Lung phantom
1. Open a shell in \Phaso\Virms\Src\Web
1. dotnet run --environment "Development" Web.csproj
1. Open "http://localhost:5000/" in a Web browser and select 'Lung Phantom'
   - The button 'Take control' is visible
1. Press 'Take control'
   - Upper, Lower and Gating actuators move when moving the sliders
1. Select 'Automatic', the motion pattern 'Free-breath Gating, Pos 1-2' and press 'Start'
   - All actuators move
   - The phantom moves the longitudinal axis  in a sine^4 curve
1. End of the test

## 6. Test Live-Image Producer
136. Start the application '\Virms.LiveImageProducer\LiveImageProducer.exe'
   - Four images are created and updated in C:\Temp: full-live.jpg, first-live.jpg, second-live.jpg, third-live.jpg
