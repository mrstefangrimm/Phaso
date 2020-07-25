# Phaso Build Verification Test Specification

The test steps can be executed in arbitrary order.

## 0. Preparation

Required software:

- powershell

- SoftDKb

- ViphApp

- MophDroid installed on an Android device

Required phantoms:

- Marker phantom
- Liver phantom
- Lung phantom

## 1. Test Marker Phantom ModelType1

1. Connect the PC to the Marker phantom
2. In the powershell, start 'setup.ps1'
   - The COM ports are listed
2. Enter the correct COM port, e.g. 'COM4'
3. Enter as phantom model '1'
4. Confirm the firmware upload with 'y'
   - On the powershell, the line 'avrdude done. Thank you.' can be found
   - On the powershell, the line 'OP-nano: 6.4.0' can be found
   - On the powershell, the line 'EnterStateTextMode' can be found
5. Confirm the EEPROM update with 'y'
6. Confirm run test with 'y'
   - On the powershell,  the EEPROM content is printed, including the calibration data
   - On the powershell, the line 'Marker m1' can be found
   - On the powershell, the last line is 'Complete'
7. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '1'
   - The software is in state 'Remote' (red bulb)
8. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
9. Test all the axes and check that the phantom moves the correct axis in the right direction
10. Press 'P'
   - The software is in state 'Preset Motion' (blue bulb)
11. Start preset '4'
   - The phantom moves the longitudinal axes  in a sin wave
12. Close the SoftDKb
13. Start the application '\Virms.NET\ViphApp.exe'
   - The marker phantom is displayed
14. Select the COM port and press 'Connect'
   - The connect button changes to 'Disconnect'
15. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
16. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'
   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave
17. Press 'Disconnect' and close the application
   - The phantom stops moving and the application closes
18. Connect the Android device and start MophDroid
   - The status is 'Synced'
19. In the Service Menu, select 'Marker phantom'
20. Select 'MANUAL'
21. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
22. Select 'PRESET', select 'Preset 4' and press 'Start'
   - The phantom moves the longitudinal axis  in a sin wave
23. Press 'Stop'
   - The phantom stops moving
24. Close MophDroid and disconnect the Android device.
25. End of the test

## 2. Test Marker Phantom ModelType2

26. Connect the PC to the Marker phantom
27. 2. In the powershell, start 'setup.ps1'
   - The COM ports are listed
28. Enter the correct COM port, e.g. 'COM4'
29. Enter as phantom model '2'
30. Confirm the firmware upload with 'y'
   - On the powershell, the line 'avrdude done. Thank you.' can be found
   - On the powershell, the line 'OP-nano: 6.4.0' can be found
   - On the powershell, the line 'EnterStateTextMode' can be found
31. Confirm the EEPROM update with 'y'
32. Confirm run test with 'y'
   - On the powershell,  the EEPROM content is printed, including the calibration data
   - On the powershell, the line 'Marker m2' can be found
   - On the powershell, the last line is 'Complete'
33. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '2'
   - The software is in state 'Remote' (red bulb)
34. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
35. Test all the axes and check that the phantom moves the correct axis in the right direction
36. Press 'P'

   - The software is in state 'Preset Motion' (blue bulb)

37. Start preset '4'

   - The phantom moves the longitudinal axes  in a sin wave

38. Close the SoftDKb
39. Start the application '\Virms.NET\ViphApp.exe'

   - The marker phantom is displayed

40. Select the COM port and press 'Connect'

   - The connect button changes to 'Disconnect'

41. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
42. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'

   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave

43. Press 'Disconnect' and close the application

   - The phantom stops moving and the application closes

44. Connect the Android device and start MophDroid

   - The status is 'Synced'

45. In the Service Menu, select 'Marker phantom'
46. Select 'MANUAL'
47. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
48. Select 'PRESET', select 'Preset 4' and press 'Start'

   - The phantom moves the longitudinal axis  in a sin wave

49. Press 'Stop'

   - The phantom stops moving

50. Close MophDroid and disconnect the Android device.
51. End of the test

## 3. Test Marker Phantom ModelType3

52. Connect the PC to the Marker phantom
53. In the powershell, start 'setup.ps1'
   - The COM ports are listed
54. Enter the correct COM port, e.g. 'COM4'
55. Enter as phantom model '3'
56. Confirm the firmware upload with 'y'
   - On the powershell, the line 'avrdude done. Thank you.' can be found
   - On the powershell, the line 'OP-nano: 6.4.0' can be found
   - On the powershell, the line 'EnterStateTextMode' can be found
57. Confirm the EEPROM update with 'y'
58. Confirm run test with 'y'
   - On the powershell,  the EEPROM content is printed, including the calibration data
   - On the powershell, the line 'Marker m3' can be found
   - On the powershell, the last line is 'Complete'
59. On the DKb, the green LED is lit
60. Test all the axes and check that the phantom moves the correct axis in the right direction
61. Press on the Remote mode button
   -  The red LED is lit
62. Press on the Preset mode button
   - The blue LED is lit
63. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '3'
   - The software is in state 'Manual' (green bulb)
64. Test all the axes and check that the phantom moves the correct axis in the right direction
65. Press 'P'

   - The software is in state 'Preset Motion' (blue bulb)

66. Start preset '4'

   - The phantom moves the longitudinal axes  in a sin wave

67. Close the SoftDKb
68. Start the application '\Virms.NET\ViphApp.exe'

   - The marker phantom is displayed

69. Select the COM port and press 'Connect'

   - The connect button changes to 'Disconnect'

70. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
71. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'

   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave

72. Press 'Disconnect' and close the application

   - The phantom stops moving and the application closes

73. Connect the Android device and start MophDroid

   - The status is 'Synced'

74. In the Service Menu, select 'Marker phantom'
75. Select 'MANUAL'
76. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
77. Select 'PRESET', select 'Preset 4' and press 'Start'

   - The phantom moves the longitudinal axis  in a sin wave

78. Press 'Stop'

   - The phantom stops moving

79. Close MophDroid and disconnect the Android device.
80. End of the test

## 4. Test Marker Phantom ModelType4

81. Connect the PC to the Liver phantom
82. In the powershell, start 'setup.ps1'
   - The COM ports are listed
83. Enter the correct COM port, e.g. 'COM4'
84. Enter as phantom model '4'
85. Confirm the firmware upload with 'y'
   - On the powershell, the line 'avrdude done. Thank you.' can be found
   - On the powershell, the line 'OP-nano: 6.4.0' can be found
   - On the powershell, the line 'EnterStateTextMode' can be found
86. Confirm the EEPROM update with 'y'
87. Confirm run test with 'y'
   - On the powershell,  the EEPROM content is printed, including the calibration data
   - On the powershell, the line 'Liver m4' can be found
   - On the powershell, the last line is 'Complete'
88. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '4'
   - The software is in state 'Remote' (red bulb)
89. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
90. Test all the axes and check that the phantom moves the correct axis in the right direction
91. Press 'P'

   - The software is in state 'Preset Motion' (blue bulb)

91. Start preset '4'

   - The phantom moves the longitudinal axes  in a sin wave

92. Close the SoftDKb
93. Start the application '\Virms.NET\ViphApp.exe'

   - The marker phantom is displayed

94. Select the COM port and press 'Connect'

   - The connect button changes to 'Disconnect'

95. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
96. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'

   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave

97. Press 'Disconnect' and close the application

   - The phantom stops moving and the application closes

98. Connect the Android device and start MophDroid

   - The status is 'Synced'

99. In the Service Menu, select 'Marker phantom'
100. Select 'MANUAL'
101. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
102. Select 'PRESET', select 'Preset 4' and press 'Start'

   - The phantom moves the longitudinal axis  in a sin wave

103. Press 'Stop'

   - The phantom stops moving

104. Close MophDroid and disconnect the Android device.
105. End of the test

## Test Marker Phantom ModelType5

106. Connect the PC to the Liver phantom
107. In the powershell, start 'setup.ps1'
   - The COM ports are listed
108. Enter the correct COM port, e.g. 'COM4'
109. Enter as phantom model '5'
110. Confirm the firmware upload with 'y'
   - On the powershell, the line 'avrdude done. Thank you.' can be found
   - On the powershell, the line 'OP-nano: 6.4.0' can be found
   - On the powershell, the line 'EnterStateTextMode' can be found
111. Confirm the EEPROM update with 'y'
112. Confirm run test with 'y'
   - On the powershell,  the EEPROM content is printed, including the calibration data
   - On the powershell, the line 'Lung m5' can be found
   - On the powershell, the last line is 'Complete'
113. Start the application '\SoftDKb\SoftDKb.exe'
   - The Model is '5'
   - The software is in state 'Remote' (red bulb)
114. Press 'M'
   - The software is in state 'Manual Motion' (green bulb)
115. Test all the axes and check that the phantom moves the correct axis in the right direction
116. Press 'P'

   - The software is in state 'Preset Motion' (blue bulb)

117. Start preset '4'

   - The phantom moves the longitudinal axes  in a sin wave

118. Close the SoftDKb
119. Start the application '\Virms.NET\ViphApp.exe'

   - The marker phantom is displayed

120. Select the COM port and press 'Connect'

   - The connect button changes to 'Disconnect'

121. On the right fly-in, test all the axis and check that the phantom moves the right axis in the right direction
122. On the right fly-in, press 'Automatic', select 'Program 4' and press 'Run'

   - The run button changes to 'Stop'
   - The phantom moves the longitudinal axis  in a sin wave

123. Press 'Disconnect' and close the application

   - The phantom stops moving and the application closes

124. Connect the Android device and start MophDroid

   - The status is 'Synced'

125. In the Service Menu, select 'Marker phantom'
126. Select 'MANUAL'
127. Test all the axes and check that the phantom moves the correct axis in the right direction (also multiple selections are possible)
128. Select 'PRESET', select 'Preset 4' and press 'Start'

   - The phantom moves the longitudinal axis  in a sin wave

129. Press 'Stop'

   - The phantom stops moving

130. Close MophDroid and disconnect the Android device.
131. End of the test