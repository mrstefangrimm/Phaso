// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the LGPL. See LICENSE file in the project root for full license information.
//
package com.github.mophdroid;

public interface ISerialObservable {

    void registerObserver(ISerialObserver observer);

    void serialWrite(byte[] bytes);

    void resync();
}
