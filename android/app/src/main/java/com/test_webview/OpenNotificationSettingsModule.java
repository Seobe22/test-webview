package com.test_webview;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.os.Build;


import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class OpenNotificationSettingsModule extends ReactContextBaseJavaModule{
    OpenNotificationSettingsModule(ReactApplicationContext context) {
        super(context);
    }
    @Override
    public String getName() {
        return "OpenNotificationSettingsModule";
    }
    @ReactMethod
    public void openNotificationSettings() {
        String packageName = "com.coin8949";
        Activity activity = getCurrentActivity();
        Intent intent = new Intent();
        if( android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            intent.setAction(android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, packageName);
        } else {
            intent.setAction(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + packageName));
        }
        activity.startActivity(intent);
    }
}