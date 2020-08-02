package com.github.mophdroid.no3;

import android.app.Activity;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Spinner;
import android.widget.TextView;

import com.github.mophdroid.*;

public class PresetFragment extends Fragment implements ISerialObserver {

    private enum State {
        Stopped, Running
    }

    private Spinner mPreset;
    private TextView mDesc;
    private TextView mUpperLng;
    private TextView mUpperRtn;
    private TextView mLowerLng;
    private TextView mLowerRtn;
    private TextView mGatingLng;
    private TextView mGatingRtn;
    private TextView mStatus;
    private State mState;
    private int mSelected;
    public static PresetFragment newInstance() {
        return new PresetFragment();
    }

    private void select(int presetNum, State state) {
        ISerialObservable act = (ISerialObservable) getActivity();
        switch (presetNum) {
            default: break;
            case 1:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x99 });
                break;
            case 2:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x91 });
                break;
            case 3:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x89 });
                break;
            case 4:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x81 });
                break;
            case 5:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x31 });
                break;
            case 6:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x29 });
                break;
            case 7:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x21 });
                break;
            case 8:
                mState = state;
                act.serialWrite(new byte[] { (byte)0x39 });
                break;
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.no3_preset_fragment, container, false);
        mPreset = root.findViewById(R.id.spPreset);
        mDesc = root.findViewById(R.id.txtDescription);
        mUpperLng = root.findViewById(R.id.txtUpperLng);
        mUpperRtn = root.findViewById(R.id.txtUpperRtn);
        mLowerLng = root.findViewById(R.id.txtLowerLng);
        mLowerRtn = root.findViewById(R.id.txtLowerRtn);
        mGatingLng = root.findViewById(R.id.txtGatingLng);
        mGatingRtn = root.findViewById(R.id.txtGatingRtn);
        mStatus = root.findViewById(R.id.txtStatus);

        root.findViewById(R.id.btnStart).setOnClickListener(
                v -> {
                    // stop by selecting the mode
                    select(mSelected, State.Stopped);
                    // start by selecting the mode
                    select(mSelected, State.Running);
                    mStatus.setText("Running");
                });

        root.findViewById(R.id.btnStop).setOnClickListener(
                v -> {
                   mStatus.setText("Stopped");
                    if (mState == State.Running) {
                        // stop by selecting some different mode
                        select((mSelected % 8) + 1, State.Stopped);
                    }
                });

        mPreset.setOnItemSelectedListener(
                new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                        mSelected = i + 1;
                        switch (mSelected) {
                            default: break;
                            case 1: mDesc.setText("Position 1."); break;
                            case 2: mDesc.setText("Position 2."); break;
                            case 3: mDesc.setText("Oscillating Position 1 <-> 2."); break;
                            case 4: mDesc.setText("Free-breath Gating."); break;
                            case 5: mDesc.setText("Breath-hold Gating."); break;
                            case 6: mDesc.setText("Free-breath Gating, Position 1 <-> 2."); break;
                            case 7: mDesc.setText("Free-breath Gating loosing signal."); break;
                            case 8: mDesc.setText("Free-breath Gating base line shift."); break;
                        }
                    }
                    @Override
                    public void onNothingSelected(AdapterView<?> adapterView) {
                    }
                });
        return root;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ISerialObservable act = (ISerialObservable)getActivity();
        act.registerObserver(this);
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
            case 0: mLowerRtn.setText(new Integer(pos).toString()); break;
            case 1: mUpperRtn.setText(new Integer(pos).toString()); break;
            case 2: mGatingRtn.setText(new Integer(pos).toString()); break;
            case 3: mLowerLng.setText(new Integer(pos).toString()); break;
            case 4: mUpperLng.setText(new Integer(pos).toString()); break;
            case 5: mGatingLng.setText(new Integer(pos).toString()); break;
        }
    }

    @Override
    public void pageChanged(int tabPos, Activity activity) {
        if (tabPos == 2) {
            ISerialObservable act = (ISerialObservable) getActivity();
            act.serialWrite(new byte[] { (byte)0xA9 });
            mState = State.Stopped;
            mStatus.setText("Stopped");
        }
    }
}
