const fs = require('fs');
const path = require('path');

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Write Java source files for MAC address native module
function writeNativeModuleFiles() {
  const packagePath = path.join(__dirname, '../android/app/src/main/java/com/pharmasolution/app');
  ensureDirectoryExists(packagePath);

  // Create MacAddressModule.java
  const moduleContent = `package com.pharmasolution.app;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;

public class MacAddressModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public MacAddressModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "MacAddressModule";
    }

    @ReactMethod
    public void getMacAddress(Promise promise) {
        try {
            String macAddress = "";
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // For Android 6.0+ (API level 23+), we need to use NetworkInterface
                macAddress = getMacAddressFromNetworkInterface();
            } else {
                // For older Android versions
                WifiManager wifiManager = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
                WifiInfo wifiInfo = wifiManager.getConnectionInfo();
                macAddress = wifiInfo.getMacAddress();
            }
            
            if (macAddress == null || macAddress.equals("02:00:00:00:00:00") || macAddress.isEmpty()) {
                // Try another approach
                macAddress = getMacAddressFromNetworkInterface();
            }
            
            promise.resolve(macAddress);
        } catch (Exception e) {
            promise.reject("MAC_ADDRESS_ERROR", e.getMessage(), e);
        }
    }
    
    private String getMacAddressFromNetworkInterface() {
        try {
            List<NetworkInterface> networkInterfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface networkInterface : networkInterfaces) {
                if (networkInterface.getName().equalsIgnoreCase("wlan0")) {
                    byte[] macBytes = networkInterface.getHardwareAddress();
                    if (macBytes == null) {
                        return "";
                    }
                    
                    StringBuilder macAddressBuilder = new StringBuilder();
                    for (int i = 0; i < macBytes.length; i++) {
                        macAddressBuilder.append(String.format("%02X:", macBytes[i]));
                    }
                    
                    if (macAddressBuilder.length() > 0) {
                        macAddressBuilder.deleteCharAt(macAddressBuilder.length() - 1);
                    }
                    
                    return macAddressBuilder.toString();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return "";
    }
}`;

  // Create MacAddressPackage.java
  const packageContent = `package com.pharmasolution.app;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MacAddressPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MacAddressModule(reactContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}`;

  // Write files
  fs.writeFileSync(path.join(packagePath, 'MacAddressModule.java'), moduleContent);
  fs.writeFileSync(path.join(packagePath, 'MacAddressPackage.java'), packageContent);
  
  console.log('Native module files generated successfully!');
}

// Main execution
try {
  writeNativeModuleFiles();
} catch (error) {
  console.error('Error generating native module files:', error);
  process.exit(1);
} 