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
import android.text.method.ScrollingMovementMethod;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.github.mophdroid.*;

public class StatusInfoFragment extends Fragment implements ISerialObserver {

    private TextView mLogOutput;
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
    private TextView mSynced;
    private TextView mFreeMem;

    // https://developer.android.com/topic/libraries/architecture/viewmodel#java
    private class StatusVM extends ViewModel {
        public boolean synced;
        public int freeMem;
        public CharSequence log;
    }
    private StatusVM mViewModel = new StatusVM();

    public static StatusInfoFragment newInstance() {
        return new StatusInfoFragment();
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
        View root = inflater.inflate(R.layout.gris5a_status_info_fragment, container, false);
        mLogOutput = root.findViewById(R.id.txtLogOutput);
        mLogOutput.setMovementMethod(new ScrollingMovementMethod());
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
        mSynced = root.findViewById(R.id.txtSynced);
        mFreeMem = root.findViewById(R.id.txtFreeMem);
        root.findViewById(R.id.btnClear).setOnClickListener(
                v -> {
                    mLogOutput.setText("");
                });
        root.findViewById(R.id.btnSync).setOnClickListener(
                v -> {
                    mSynced.setText("Not Synced");
                    ISerialObservable act = (ISerialObservable) getActivity();
                    act.resync();
                });
        root.findViewById(R.id.btnFreeMem).setOnClickListener(
                v -> {
                    ISerialObservable act = (ISerialObservable) getActivity();
                    act.serialWrite(new byte[]{0x13});
                });
        return root;
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        // VM must be in its own file as it seems mViewModel = ViewModelProviders.of(this).get(StatusVM.class);
        if (mViewModel.log != null) {
            for (int n = 0; n < mViewModel.log.length(); n++) {
                mLogOutput.append(String.valueOf(mViewModel.log.charAt(n)));
            }
            mSynced.setText(mViewModel.synced ? "Synced" : "Not Synced");
            mFreeMem.setText(new Integer(mViewModel.freeMem).toString());
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();

        if (mViewModel != null) {
            mViewModel.log = mLogOutput.getText();
            if (mViewModel.log.length() > 50) {
                mViewModel.log.subSequence(mViewModel.log.length()- 51, mViewModel.log.length() - 1);
                // SharedViewModel model = ViewModelProviders.of(getActivity()).get(SharedViewModel.class);
            }
            mViewModel.synced = (mSynced.getText().equals("Synced"));
            mViewModel.freeMem = Integer.parseInt(mFreeMem.getText().toString());
        }
    }

    @Override
    public void rawOutput(String rawData){
        mLogOutput.append(rawData);
    }

    @Override
    public void logOutput(String text){
        mLogOutput.append(text);
    }

    @Override
    public void statusInfo(StatusInfo status) {
        switch (status) {
            default: break;
            case SYNCED: {
                mSynced.setText("Synced");
                // Start position stream
                ISerialObservable act = (ISerialObservable) getActivity();
                act.serialWrite(new byte[]{0x3B});
            } break;
            case NOT_SYNCED: mSynced.setText("Not Synced"); break;
        }
    }

    @Override
    public void freeMemory(int freeMem) {
        mFreeMem.setText(new Integer(freeMem).toString());
    }

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
    public void pageChanged(int tabPos, Activity activity) {}
}
