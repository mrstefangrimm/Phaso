// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the LGPL. See LICENSE file in the project root for full license information.
//
package com.github.mophdroid;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import com.google.android.material.tabs.TabLayout;
import androidx.viewpager.widget.ViewPager;
import androidx.appcompat.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.Toast;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Set;

public class MainActivity extends AppCompatActivity implements ISerialObservable {

    private UsbService mUsbService;
    private MessageDispatcher mHandler;
    private ArrayList<ISerialObserver> mObservers = new ArrayList<>();

    private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            switch (intent.getAction()) {
                case UsbService.ACTION_USB_PERMISSION_GRANTED: // USB PERMISSION GRANTED
                    Toast.makeText(context, "USB Ready", Toast.LENGTH_SHORT).show();
                    break;
                case UsbService.ACTION_USB_PERMISSION_NOT_GRANTED: // USB PERMISSION NOT GRANTED
                    Toast.makeText(context, "USB Permission not granted", Toast.LENGTH_SHORT).show();
                    break;
                case UsbService.ACTION_NO_USB: // NO USB CONNECTED
                    Toast.makeText(context, "No USB connected", Toast.LENGTH_SHORT).show();
                    break;
                case UsbService.ACTION_USB_DISCONNECTED: // USB DISCONNECTED
                    Toast.makeText(context, "USB disconnected", Toast.LENGTH_SHORT).show();
                    break;
                case UsbService.ACTION_USB_NOT_SUPPORTED: // USB NOT SUPPORTED
                    Toast.makeText(context, "USB device not supported", Toast.LENGTH_SHORT).show();
                    break;
            }
        }
    };

    private final ServiceConnection mUsbConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName arg0, IBinder arg1) {
            mUsbService = ((UsbService.UsbBinder) arg1).getService();
            mUsbService.setHandler(mHandler);
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            mUsbService = null;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mHandler = new MessageDispatcher(this);

        TabsPagerAdapter sectionsPagerAdapter = new TabsPagerAdapter(this, getSupportFragmentManager());
        ViewPager viewPager = findViewById(R.id.view_pager);
        viewPager.setAdapter(sectionsPagerAdapter);
        TabLayout tabs = findViewById(R.id.tabs);
        tabs.setupWithViewPager(viewPager);
        viewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabs) {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                mHandler.firePageChanged(position);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        setFilters();
        startService(UsbService.class, mUsbConnection, null);
    }

    @Override
    public void onPause() {
        super.onPause();
        unregisterReceiver(mUsbReceiver);
        unbindService(mUsbConnection);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.service_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.service:
                Intent intent = new Intent(this, ServiceActivity.class);
                startActivity(intent);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void registerObserver(ISerialObserver observer) {
        mObservers.add(observer);
    }

    @Override
    public void serialWrite(byte[] bytes) {
        if (mUsbService != null) {
            mUsbService.write(bytes);
        }
    }

    @Override
    public void resync() {
        mHandler.clear();
        if (mUsbService != null) {
            // Stop position stream and send sync
            mUsbService.write(new byte[]{0x43});
            mUsbService.write(new byte[]{0x0B});
        }
    }

    private void startService(Class<?> service, ServiceConnection serviceConnection, Bundle extras) {
        if (!UsbService.SERVICE_CONNECTED) {
            Intent startService = new Intent(this, service);
            if (extras != null && !extras.isEmpty()) {
                Set<String> keys = extras.keySet();
                for (String key : keys) {
                    String extra = extras.getString(key);
                    startService.putExtra(key, extra);
                }
            }
            startService(startService);
        }
        Intent bindingIntent = new Intent(this, service);
        bindService(bindingIntent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    private void setFilters() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(UsbService.ACTION_USB_PERMISSION_GRANTED);
        filter.addAction(UsbService.ACTION_NO_USB);
        filter.addAction(UsbService.ACTION_USB_DISCONNECTED);
        filter.addAction(UsbService.ACTION_USB_NOT_SUPPORTED);
        filter.addAction(UsbService.ACTION_USB_PERMISSION_NOT_GRANTED);
        registerReceiver(mUsbReceiver, filter);
    }

    private static class MessageDispatcher extends Handler {

        private final WeakReference<MainActivity> mActivity;
        private boolean mSynced;
        private boolean mReceiving;
        private char[] mRecvBuffer;
        private int mReadingPos;

        public MessageDispatcher(MainActivity activity) {
            mActivity = new WeakReference<>(activity);
            clear();
        }

        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case UsbService.MESSAGE_FROM_SERIAL_PORT:
                    String data = (String)msg.obj;
                    if (!mSynced) {
                        fireLogOutput(data);

                        for (char val : data.toCharArray()) {
                            mRecvBuffer[mReadingPos] = val;
                            if (mReadingPos < mRecvBuffer.length - 1) {
                                mReadingPos++;
                            }
                            else {
                                for (int n=1; n <  mRecvBuffer.length - 1; n++) {
                                    mRecvBuffer[n-1] = mRecvBuffer[n];
                                }
                            }

                            if (mReadingPos == 9) {
                                if (mRecvBuffer[0] == 'S' &&
                                        mRecvBuffer[1] == 'y' &&
                                        mRecvBuffer[2] == 'n' &&
                                        mRecvBuffer[3] == 'c' &&
                                        mRecvBuffer[4] == 'e' &&
                                        mRecvBuffer[5] == 'd') {
                                    mSynced = true;
                                    mReceiving = false;
                                    mReadingPos = 0;
                                    fireStatusInfo(StatusInfo.SYNCED);
                                    break;
                                }
                            }
                        }
                    }
                    if (mSynced) {
                        for (char val : data.toCharArray()) {

                            if (!mReceiving && val != '|') {
                                fireLogOutput(new String(new char[]{val}));
                            }

                            if (val == '|') {
                                mReceiving = !mReceiving;
                                if (mReceiving) {
                                    mReadingPos = 0;
                                }
                                else if (mRecvBuffer[0] == 'G') { fireStatusInfo(StatusInfo.MANUAL_MOTION_MODE); }
                                else if (mRecvBuffer[0] == 'H') { fireStatusInfo(StatusInfo.PRESET_MODE); }
                                else if (mRecvBuffer[0] == 'I') { fireStatusInfo(StatusInfo.REMOTE_MODE); }
                                else if (mRecvBuffer[0] == 'J') { fireStatusInfo(StatusInfo.CALIBRATION_MODE); }
                                else if (mRecvBuffer[0] == 'K') { fireFreeMemory(getReceivedNumber()); }
                                else if (mRecvBuffer[0] == 'L') {
                                    // TODO: Implement get model
                                    fireLogOutput("Model : " + getReceivedNumber());
                                }
                                else if (mRecvBuffer[0] == 'M') {
                                    // TODO: Implement get version
                                    fireLogOutput("Version : " + mRecvBuffer);
                                }
                                else if (mRecvBuffer[0] == 'N') {
                                    // Get device data is not supported
                                }
                                else {
                                    int motor = mRecvBuffer[0] - '0';
                                    if (mRecvBuffer[0] >= 'A' && mRecvBuffer[0] <= 'F') {
                                        motor = 10 + (mRecvBuffer[0] - 'A');
                                    }
                                    fireServoPosition(motor, getReceivedNumber());
                                }
                            }
                            else if (mReceiving) {
                                mRecvBuffer[mReadingPos] = val;
                                mReadingPos++;
                                if (mReadingPos >= 10) mReadingPos = 0;
                            }
                        }
                    }
                    break;
                case UsbService.CTS_CHANGE:
                    Toast.makeText(mActivity.get(), "CTS_CHANGE",Toast.LENGTH_LONG).show();
                    break;
                case UsbService.DSR_CHANGE:
                    Toast.makeText(mActivity.get(), "DSR_CHANGE",Toast.LENGTH_LONG).show();
                    break;
            }
        }

        private void fireRawOutput(String rawData) {
            for (ISerialObserver recv : mActivity.get().mObservers) {
                recv.rawOutput(rawData);
            }
        }

        private void fireLogOutput(String text) {
            for (ISerialObserver recv : mActivity.get().mObservers) {
                recv.logOutput(text);
            }
        }

        private void fireStatusInfo(StatusInfo status) {
            for (ISerialObserver recv : mActivity.get().mObservers) {
                recv.statusInfo(status);
            }
        }

        private void fireFreeMemory(int freeMem) {
            for (ISerialObserver recv : mActivity.get().mObservers) {
                recv.freeMemory(freeMem);
            }
        }

        private void fireServoPosition(int servoNum, int pos) {
            for (ISerialObserver recv : mActivity.get().mObservers) {
                recv.servoPosition(servoNum, pos);
            }
        }

        private void firePageChanged(int pagePos) {
            for (ISerialObserver recv : mActivity.get().mObservers) {
                recv.pageChanged(pagePos, mActivity.get());
            }
        }

        private int getReceivedNumber() {
            int pos = 0;
            int pot = 0;
            for (int n = mReadingPos - 1; n > 0; n--, pot++) {
                int nval = mRecvBuffer[n] - '0';
                int fac = (int) Math.pow(10, pot);
                pos += nval * fac;
            }
            return pos;
        }

        private void clear() {
            mRecvBuffer = new char[10];
            mSynced = false;
            mReceiving = false;
            mReadingPos = 0;
        }

    }
}