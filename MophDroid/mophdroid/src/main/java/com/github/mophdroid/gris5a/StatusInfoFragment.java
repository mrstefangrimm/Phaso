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
    private TextView mLeftLng;
    private TextView mLeftRtn;
    private TextView mRightLng;
    private TextView mRightRtn;
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
        mLeftLng = root.findViewById(R.id.txtLeftUpperLng);
        mLeftRtn = root.findViewById(R.id.txtLeftUpperRtn);
        mRightLng = root.findViewById(R.id.txtRightUpperLng);
        mRightRtn = root.findViewById(R.id.txtRightUpperRtn);
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
                    act.serialWrite(new byte[]{0x3});
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
            case SYNCED: mSynced.setText("Synced"); break;
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
            case 0: mLeftLng.setText(new Integer(pos).toString()); break;
            case 1: mRightLng.setText(new Integer(pos).toString()); break;
            case 2: mGatingLng.setText(new Integer(pos).toString()); break;
            case 3: mLeftRtn.setText(new Integer(pos).toString()); break;
            case 4: mRightRtn.setText(new Integer(pos).toString()); break;
            case 5: mGatingRtn.setText(new Integer(pos).toString()); break;
        }
    }

    @Override
    public void pageChanged(int tabPos, Activity activity) {}
}
