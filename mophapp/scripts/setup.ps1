$SERIALDELAY=400
$AVRUP=".\upload_arduinosoftware.bat"

[System.IO.Ports.SerialPort]::GetPortNames()
$portname = Read-Host "Please enter the Arduino COM port (e.g. COM9)"
$portname.Trim()

$model = Read-Host "Please enter the phantom model (e.g. 5)"
$model.Trim()

$confirmation = Read-Host "Are you sure you want to upload the firmware (y/n)"
if ($confirmation -ne 'y') {
  "your choice, bye"
  break
}
& $AVRUP $portname $model

$port = new-Object System.IO.Ports.SerialPort $portname, 9600, None, 8, one
if ($port.IsOpen) {
  "The port is already open, something is wrong. Say goodbye."
   break
}
$port.Open(); Start-Sleep -Milliseconds 4000

#Enter text mode
$port.WriteLine("'"); Start-Sleep -Milliseconds $SERIALDELAY
$port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY

"Read current EEPROM values"
$port.WriteLine("d10 0 1"); Start-Sleep -Milliseconds $SERIALDELAY
$curModel = $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d10 1 1"); Start-Sleep -Milliseconds $SERIALDELAY
$curScheme = $port.ReadExisting(); Start-Sleep -Milliseconds 500
$port.WriteLine("d10 2 5"); Start-Sleep -Milliseconds $SERIALDELAY
$curName = $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY

"Model  : " + $curModel.Trim()
"Scheme : " + $curScheme.Trim()
"Name   : " + $curName.Trim()

$confirmation = Read-Host "Are you sure you want to write to the EEPROM (y/n)"
if ($confirmation -ne 'y') {
  "Your choice. Say goodbye."
  $port.Close()
  break
}

$calibrationScript = ".\calibrate_m" + $model + ".ps1"
& $calibrationScript

$confirmation = Read-Host "Run test (y/n)"
if ($confirmation -eq 'y') {
  # enter calibration (get device data only works in this mode)
  $port.WriteLine("xB9"); Start-Sleep -Milliseconds $SERIALDELAY
  # get device data
  $port.WriteLine("x2B"); Start-Sleep -Milliseconds 3000
  $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
  # reset
  $port.WriteLine("x4B"); Start-Sleep -Milliseconds $SERIALDELAY
}

"Complete"
$port.Close()

Read-Host -Prompt "Press any key to exit"