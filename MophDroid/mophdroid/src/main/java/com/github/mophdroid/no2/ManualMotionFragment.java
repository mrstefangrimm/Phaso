// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the LGPL. See LICENSE file in the project root for full license information.
//
package com.github.mophdroid.no2;

import androidx.lifecycle.ViewModel;

import android.app.Activity;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.ToggleButton;
import com.github.mophdroid.*;

public class ManualMotionFragment extends Fragment implements ISerialObserver {

    private TextView mLeftLng;
    private TextView mLeftRtn;
    private TextView mRightLng;
    private TextView mRightRtn;
    private TextView mGatingLng;
    private TextView mGatingRtn;
    private ToggleButton mCbLeft;
    private ToggleButton mCbRight;
    private ToggleButton mCbGating;

    // https://developer.android.com/topic/libraries/architecture/viewmodel#java
    private class ManualMotionVM extends ViewModel {
        public boolean left;
        public boolean right;
        public boolean gating;
    }
    private ManualMotionVM mViewModel = new ManualMotionVM();

    public static ManualMotionFragment newInstance() {
        return new ManualMotionFragment();
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ISerialObservable act = (ISerialObservable)getActivity();
        act.registerObserver(this);
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.no2_manual_motion_fragment, container, false);
        mLeftLng = root.findViewById(R.id.txtLeftLng);
        mLeftRtn = root.findViewById(R.id.txtLeftRtn);
        mRightLng = root.findViewById(R.id.txtRightLng);
        mRightRtn = root.findViewById(R.id.txtRightRtn);
        mGatingLng = root.findViewById(R.id.txtGatingtLng);
        mGatingRtn = root.findViewById(R.id.txtGatingRtn);
        mCbLeft = root.findViewById(R.id.cbLeft);
        mCbRight = root.findViewById(R.id.cbRight);
        mCbGating = root.findViewById(R.id.cbGating);

        root.findViewById(R.id.btnLeft).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeft.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xD1 });
                    }
                    if (mCbRight.isChecked()) {
                        act.serialWrite(new byte[]{ 0x51 });
                    }
                    if (mCbGating.isChecked()) {
                        act.serialWrite(new byte[]{ 0x01 });
                    }
                });
        root.findViewById(R.id.btnRight).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeft.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xC9 });
                    }
                    if (mCbRight.isChecked()) {
                        act.serialWrite(new byte[]{ 0x49 });
                    }
                    if (mCbGating.isChecked()) {
                        act.serialWrite(new byte[]{ 0x19 });
                    }
                });
        root.findViewById(R.id.btnUp).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeft.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xD9 });
                    }
                    if (mCbRight.isChecked()) {
                        act.serialWrite(new byte[]{ 0x59 });
                    }
                    if (mCbGating.isChecked()) {
                        act.serialWrite(new byte[]{ 0x09 });
                    }
                });
        root.findViewById(R.id.btnDown).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeft.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xC1 });
                    }
                    if (mCbRight.isChecked()) {
                        act.serialWrite(new byte[]{ 0x41 });
                    }
                    if (mCbGating.isChecked()) {
                        act.serialWrite(new byte[]{ 0x11 });
                    }
                });
        ((SeekBar)root.findViewById(R.id.sbSpeed)).setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
                    int mProgressChangedValue = 1;
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        mProgressChangedValue = progress + 1;
                    }
                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {
                    }
                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        ISerialObservable act = (ISerialObservable) getActivity();
                        switch (mProgressChangedValue){
                            default: break;
                            case 1: act.serialWrite(new byte[]{ (byte)0x99 }); break;
                            case 2: act.serialWrite(new byte[]{ (byte)0x91 }); break;
                            case 3: act.serialWrite(new byte[]{ (byte)0x89 }); break;
                            case 4: act.serialWrite(new byte[]{ (byte)0x81 }); break;
                            case 5: act.serialWrite(new byte[]{ (byte)0x31 }); break;
                            case 6: act.serialWrite(new byte[]{ (byte)0x29 }); break;
                            case 7: act.serialWrite(new byte[]{ (byte)0x21 }); break;
                            case 8: act.serialWrite(new byte[]{ (byte)0x39 }); break;
                        }

                    }
                });
        return root;
    }

    @Override
    public void rawOutput(String rawData){ }

    @Override
    public void logOutput(String text) { }

    @Override
    public void statusInfo(StatusInfo status) { }

    @Override
    public void freeMemory(int freeMem) { }

    @Override
    public void servoPosition(int servoNum, int pos) {
        switch (servoNum) {
            default: break;
            case 0: mLeftLng.setText(new Integer(pos).toString()); break;
            case 1: mRightLng.setText(new Integer(pos).toString()); break;
            case 2: mGatingLng.setText(new Integer(pos).toString()); break;
            case 3: mLeftRtn.setText(new Integer(pos).toString()); break;
            case 4: mRightRtn.setText(new Integer(pos).toString()); break;
            case 5: mGatingRtn.setText(new Integer(pos).toString()); break;
        }
    }

    @Override
    public void pageChanged(int tabPos, Activity activity) {
        if (tabPos == 1) {
            ISerialObservable act = (ISerialObservable) getActivity();
            act.serialWrite(new byte[] { (byte)0xB1 });
        }
    }
}
