// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the LGPL. See LICENSE file in the project root for full license information.
//
package com.github.mophdroid;

import android.app.Activity;

public interface ISerialObserver {

    void rawOutput(String rawData);

    void logOutput(String text);

    void statusInfo(StatusInfo status);

    void freeMemory(int freeMem);

    void servoPosition(int servoNum, int pos);

    void pageChanged(int tabPos, Activity activity);
}
