package com.github.mophdroid;

public interface ISerialObservable {

    void registerObserver(ISerialObserver observer);

    void serialWrite(byte[] bytes);

    void resync();
}
