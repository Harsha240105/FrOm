package com.harsha.form;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SpotifyPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
