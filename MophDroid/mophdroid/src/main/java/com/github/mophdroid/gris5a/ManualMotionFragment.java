// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the LGPL. See LICENSE file in the project root for full license information.
//
package com.github.mophdroid.gris5a;

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

    private TextView mLeftUpperLng;
    private TextView mLeftUpperRtn;
    private TextView mLeftLowerLng;
    private TextView mLeftLowerRtn;
    private TextView mRightUpperLng;
    private TextView mRightUpperRtn;
    private TextView mRightLowerLng;
    private TextView mRightLowerRtn;
    private TextView mGatingLng;
    private TextView mGatingRtn;
    private ToggleButton mCbLeftUpper;
    private ToggleButton mCbRightUpper;
    private ToggleButton mCbLeftLower;
    private ToggleButton mCbRightLower;
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
        View root = inflater.inflate(R.layout.gris5a_manual_motion_fragment, container, false);
        mLeftUpperLng = root.findViewById(R.id.txtLeftUpperLng);
        mLeftUpperRtn = root.findViewById(R.id.txtLeftUpperRtn);
        mRightUpperLng = root.findViewById(R.id.txtRightUpperLng);
        mRightUpperRtn = root.findViewById(R.id.txtRightUpperRtn);
        mLeftLowerLng = root.findViewById(R.id.txtLeftLowerLng);
        mLeftLowerRtn = root.findViewById(R.id.txtLeftLowerRtn);
        mRightLowerLng = root.findViewById(R.id.txtRightLowerLng);
        mRightLowerRtn = root.findViewById(R.id.txtRightLowerRtn);
        mGatingLng = root.findViewById(R.id.txtGatingtLng);
        mGatingRtn = root.findViewById(R.id.txtGatingRtn);
        mCbLeftUpper = root.findViewById(R.id.cbLeftUpper);
        mCbRightUpper = root.findViewById(R.id.cbRightUpper);
        mCbLeftLower = root.findViewById(R.id.cbLeftLower);
        mCbRightLower = root.findViewById(R.id.cbRightLower);
        mCbGating = root.findViewById(R.id.cbGating);

        root.findViewById(R.id.btnLeft).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeftLower.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xD1 });
                    }
                    if (mCbRightLower.isChecked()) {
                        act.serialWrite(new byte[]{ 0x51 });
                    }
                    if (mCbLeftUpper.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xE9 });
                    }
                    if (mCbRightUpper.isChecked()) {
                        act.serialWrite(new byte[]{ 0x69 });
                    }
                    if (mCbGating.isChecked()) {
                        act.serialWrite(new byte[]{ 0x01 });
                    }
                });
        root.findViewById(R.id.btnRight).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeftLower.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xC9 });
                    }
                    if (mCbRightLower.isChecked()) {
                        act.serialWrite(new byte[]{ 0x49 });
                    }
                    if (mCbLeftUpper.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xE1 });
                    }
                    if (mCbRightUpper.isChecked()) {
                        act.serialWrite(new byte[]{ 0x61 });
                    }
                    if (mCbGating.isChecked()) {
                        act.serialWrite(new byte[]{ 0x19 });
                    }
                });
        root.findViewById(R.id.btnUp).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeftLower.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xD9 });
                    }
                    if (mCbRightLower.isChecked()) {
                        act.serialWrite(new byte[]{ 0x59 });
                    }
                    if (mCbLeftUpper.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xF1 });
                    }
                    if (mCbRightUpper.isChecked()) {
                        act.serialWrite(new byte[]{ 0x71 });
                    }
                    if (mCbGating.isChecked()) {
                        act.serialWrite(new byte[]{ 0x09 });
                    }
                });
        root.findViewById(R.id.btnDown).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    if (mCbLeftLower.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xC1 });
                    }
                    if (mCbRightLower.isChecked()) {
                        act.serialWrite(new byte[]{ 0x41 });
                    }
                    if (mCbLeftUpper.isChecked()) {
                        act.serialWrite(new byte[]{ (byte)0xF9 });
                    }
                    if (mCbRightUpper.isChecked()) {
                        act.serialWrite(new byte[]{ 0x79 });
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
            case 0: mLeftUpperRtn.setText(new Integer(pos).toString()); break;
            case 1: mLeftUpperLng.setText(new Integer(pos).toString()); break;
            case 2: mLeftLowerRtn.setText(new Integer(pos).toString()); break;
            case 3: mLeftLowerLng.setText(new Integer(pos).toString()); break;
            case 4: mRightLowerLng.setText(new Integer(pos).toString()); break;
            case 5: mRightLowerRtn.setText(new Integer(pos).toString()); break;
            case 6: mRightUpperLng.setText(new Integer(pos).toString()); break;
            case 7: mRightUpperRtn.setText(new Integer(pos).toString()); break;
            case 8: mGatingLng.setText(new Integer(pos).toString()); break;
            case 9: mGatingRtn.setText(new Integer(pos).toString()); break;
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
