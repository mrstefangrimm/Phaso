
if ($port.IsOpen) {
  "Start writing"
} else {
  "The port is not open, something is wrong. Say goodbye."
   break
}

"write Header"
$port.WriteLine("d11 0 1 4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 1 1 1"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 2 5 Liver m4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY

# 0 (Left LNG)
"write Left LNG"
$port.WriteLine("d11 13 4 507"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 17 4 -1.4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 21 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 25 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 1 (Right LNG)
"write Right LNG"
$port.WriteLine("d11 29 4 150"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 33 4 1.4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 37 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 41 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 2 (Gating LNG)
"write Gating LNG"
$port.WriteLine("d11 45 4 150"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 49 4 1.4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 53 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 57 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 3 (Left RTN)
"write Left RTN" 
$port.WriteLine("d11 61 4 150"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 65 4 1.4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 69 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 4 (Right RTN)
"write Right RTN"
$port.WriteLine("d11 73 4 150"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 77 4 1.4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 81 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 5 (Gating RTN)
"write Gating RTN"
$port.WriteLine("d11 85 4 150"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 89 4 1.4"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
$port.WriteLine("d11 93 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# Offset
# 0 (Left LNG)
"write Left RTN"
$port.WriteLine("d11 97 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 1 (Right LNG)
"write Right RTN"
$port.WriteLine("d11 101 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 2 (Gating LNG)
"write Gating LNG"
$port.WriteLine("d11 105 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 3 (Left RTN)
"write Left RTN"
$port.WriteLine("d11 109 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 4 (Right RTN)
"write Right RTN"
$port.WriteLine("d11 113 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
# 5 (Gating RTN)
"write Gating RTN"
$port.WriteLine("d11 117 4 0"); Start-Sleep -Milliseconds $SERIALDELAY; $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY

# Check EEPROM
$port.WriteLine("d10 0 1"); Start-Sleep -Milliseconds $SERIALDELAY
$model = $port.ReadExisting(); Start-Sleep -Milliseconds $SERIALDELAY
if ($model -notmatch 4) {
  "Something went wrong. Please try again. Say goodbye."
  $port.Close()
  break
}
