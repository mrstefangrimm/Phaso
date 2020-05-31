package com.github.mophdroid;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.preference.PreferenceManager;

public class TabsPagerAdapter extends FragmentPagerAdapter {

    private static final String[] TAB_TITLES = new String[]{"Status", "Manual", "Preset" };
    private final Context mContext;

    public TabsPagerAdapter(Context context, FragmentManager fm) {
        super(fm);
        mContext = context;
    }

    @Override
    public Fragment getItem(int position) {

        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(mContext);
        String type = prefs.getString("phantomType", "No2");

        switch (position) {
            default:
                return null;
            case 0:
                if (type.equals("No2")) return com.github.mophdroid.no2.StatusInfoFragment.newInstance();
                else if (type.equals("GRIS5A")) return com.github.mophdroid.gris5a.StatusInfoFragment.newInstance();
                else return null;
            case 1:
                if (type.equals("No2")) return com.github.mophdroid.no2.ManualMotionFragment.newInstance();
                else if (type.equals("GRIS5A")) return com.github.mophdroid.gris5a.ManualMotionFragment.newInstance();
                else return null;
            case 2:
                if (type.equals("No2")) return com.github.mophdroid.no2.PresetFragment.newInstance();
                else if (type.equals("GRIS5A")) return com.github.mophdroid.gris5a.PresetFragment.newInstance();
                else return null;
        }
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        return TAB_TITLES[position];
    }

    @Override
    public int getCount() {
        return 3;
    }
}
