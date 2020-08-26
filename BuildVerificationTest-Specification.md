# Phaso Build Verification Test Specification

The test steps can be executed in arbitrary order.

## 0. Preparation

Required software:

- PowerShell

- SoftDKb

- ViphApp

- MophDroid installed on an Android device

Required phantoms:

- Marker phantom
- Liver phantom
- Lung phantom

## 1. Test Marker Phantom ModelType1

1. Connect the PC to the Marker phantom
2. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
3. Enter the correct COM port, e.g. 'COM4'
4. Enter as phantom model '1'
5. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
6. Confirm the EEPROM update with 'y'
7. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Marker m1' can be found
   - In the PowerShell, the last line is 'Complete'
8. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '1'
   - The software is in state 'Remote' (red bulb)
9. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
10. Test all the axes and check that the phantom moves the correct axis in the right direction
11. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
12. Start preset '4'
   - The phantom moves the longitudinal axes  in a sin wave
13. Close the SoftDKb
14. Start the application '\Virms.NET\ViphApp.exe'
   - The marker phantom is displayed
15. Select the COM port and press 'Connect'

   - The connect button changes to 'Disconnect'
16. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
17. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'
   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave
18. Press 'Disconnect' and close the application
   - The phantom stops moving and the application closes
19. Start MophDroid on your Android device
20. In the Service menu, select 'Marker Motion Phantom'
21. Connect the Android device to the phantom
   - The status is 'Synced'
22. In the Service Menu, select 'Marker phantom'
23. Select 'MANUAL'
24. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
25. Select 'PRESET', select 'Preset 4' and press 'Start'
   - The phantom moves the longitudinal axis  in a sin wave
26. Press 'Stop'
   - The phantom stops moving
27. Close MophDroid and disconnect the Android device.
28. End of the test

## 2. Test Marker Phantom ModelType2

29. Connect the PC to the Marker phantom
30. 2. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
31. Enter the correct COM port, e.g. 'COM4'
32. Enter as phantom model '2'
33. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
34. Confirm the EEPROM update with 'y'
35. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Marker m2' can be found
   - In the PowerShell, the last line is 'Complete'
36. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '2'
   - The software is in state 'Remote' (red bulb)
37. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
38. Test all the axes and check that the phantom moves the correct axis in the right direction
39. Press 'P'

   - The software is in state 'Preset Motion' (blue bulb)

40. Start preset '4'

   - The phantom moves the longitudinal axes  in a sin wave

41. Close the SoftDKb
42. Start the application '\Virms.NET\ViphApp.exe'

   - The marker phantom is displayed

43. Select the COM port and press 'Connect'

   - The connect button changes to 'Disconnect'

44. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
45. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'

   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave

46. Press 'Disconnect' and close the application

   - The phantom stops moving and the application closes

47. Start MophDroid on your Android device
48. In the Service menu, select 'Marker Motion Phantom'
49. Connect the Android device to the phantom

   - The status is 'Synced'

50. In the Service Menu, select 'Marker phantom'
51. Select 'MANUAL'
52. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
53. Select 'PRESET', select 'Preset 4' and press 'Start'

   - The phantom moves the longitudinal axis  in a sin wave

54. Press 'Stop'

   - The phantom stops moving

55. Close MophDroid and disconnect the Android device.
56. End of the test

## 3. Test Marker Phantom ModelType3

57. Connect the PC to the Marker phantom
58. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
59. Enter the correct COM port, e.g. 'COM4'
60. Enter as phantom model '3'
61. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
62. Confirm the EEPROM update with 'y'
63. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Marker m3' can be found
   - In the PowerShell, the last line is 'Complete'
64. On the DKb, the green LED is lit
65. Test all the axes and check that the phantom moves the correct axis in the right direction
66. Press on the Remote mode button
   -  The red LED is lit
67. Press on the Preset mode button
   - The blue LED is lit
68. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '3'
   - The software is in state 'Manual' (green bulb)
69. Test all the axes and check that the phantom moves the correct axis in the right direction
70. Press 'P'

   - The software is in state 'Preset Motion' (blue bulb)

71. Start preset '4'

   - The phantom moves the longitudinal axes  in a sin wave

72. Close the SoftDKb
73. Start the application '\Virms.NET\ViphApp.exe'

   - The marker phantom is displayed

74. Select the COM port and press 'Connect'

   - The connect button changes to 'Disconnect'

75. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
76. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'

   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave

77. Press 'Disconnect' and close the application

   - The phantom stops moving and the application closes

78. Start MophDroid on your Android device
79. In the Service menu, select 'Marker Motion Phantom'
80. Connect the Android device to the phantom

   - The status is 'Synced'

81. In the Service Menu, select 'Marker phantom'
82. Select 'MANUAL'
83. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
84. Select 'PRESET', select 'Preset 4' and press 'Start'

   - The phantom moves the longitudinal axis  in a sin wave

85. Press 'Stop'

   - The phantom stops moving

86. Close MophDroid and disconnect the Android device.
87. End of the test

## 4. Test Liver Phantom ModelType4

88. Connect the PC to the Liver phantom
89. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
90. Enter the correct COM port, e.g. 'COM4'
91. Enter as phantom model '4'
92. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
93. Confirm the EEPROM update with 'y'
94. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Liver m4' can be found
   - In the PowerShell, the last line is 'Complete'
95. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '4'
   - The software is in state 'Remote' (red bulb)
96. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
97. Test all the axes and check that the phantom moves the correct axis in the right direction
98. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
99. Start preset '4'
   - The phantom moves the longitudinal axes  in a sin wave
100. Close the SoftDKb
101. Start the application '\Virms.NET\ViphApp.exe'
   - The marker phantom is displayed
102. Select the COM port and press 'Connect'
   - The connect button changes to 'Disconnect'
103. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
104. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'
   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave
105. Press 'Disconnect' and close the application
   - The phantom stops moving and the application closes
106. Start MophDroid on your Android device
107. In the Service menu, select 'Liver Motion Phantom'
108. Connect the Android device to the phantom
   - The status is 'Synced'
109. In the Service Menu, select 'Liver Deformation Phantom'
110. Select 'MANUAL'
111. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
112. Select 'PRESET', select 'Preset 4' and press 'Start'
   - The phantom moves the longitudinal axis  in a sin wave
113. Press 'Stop'
   - The phantom stops moving
114. Close MophDroid and disconnect the Android device.
115. End of the test

## Test Lung  Phantom ModelType5

116. Connect the PC to the Liver phantom
117. In the PowerShell, start 'setup.ps1'
   - The COM ports are listed
118. Enter the correct COM port, e.g. 'COM4'
119. Enter as phantom model '5'
120. Confirm the firmware upload with 'y'
   - In the PowerShell, the line 'avrdude done. Thank you.' can be found
   - In the PowerShell, the line 'OP-nano: 6.4.0' can be found
   - In the PowerShell, the line 'EnterStateTextMode' can be found
121. Confirm the EEPROM update with 'y'
122. Confirm run test with 'y'
   - In the PowerShell,  the EEPROM content is printed, including the calibration data
   - In the PowerShell, the line 'Lung m5' can be found
   - In the PowerShell, the last line is 'Complete'
123. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '5'
   - The software is in state 'Remote' (red bulb)
124. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
125. Test all the axes and check that the phantom moves the correct axis in the right direction
126. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
127. Start preset '4'
   - The phantom moves the longitudinal axes  in a sin wave
128. Close the SoftDKb
129. Start the application '\Virms.NET\ViphApp.exe'
   - The marker phantom is displayed
130. Select the COM port and press 'Connect'
   - The connect button changes to 'Disconnect'
131. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
132. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'
   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave
133. Press 'Disconnect' and close the application
   - The phantom stops moving and the application closes
134. Start MophDroid on your Android device
135. In the Service menu, select 'Lung Motion Phantom'
136. Connect the Android device to the phantom
   - The status is 'Synced'
137. Select 'MANUAL'
138. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
139. Select 'PRESET', select 'Preset 4' and press 'Start'
   - The phantom moves the longitudinal axis  in a sin wave
140. Press 'Stop'
   - The phantom stops moving
141. Close MophDroid and disconnect the Android device.
142. End of the test