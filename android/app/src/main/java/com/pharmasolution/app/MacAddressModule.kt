package com.pharmasolution.app

import android.content.Context
import android.net.wifi.WifiManager
import android.os.Build
import androidx.annotation.NonNull
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.net.NetworkInterface
import java.util.*

class MacAddressModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    @NonNull
    override fun getName(): String {
        return "MacAddressModule"
    }
    
    @ReactMethod
    fun getMacAddress(promise: Promise) {
        try {
            var macAddress = ""
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // For Android 6.0+ (API level 23+), we need to use NetworkInterface
                macAddress = getMacAddressFromNetworkInterface()
            } else {
                // For older Android versions
                val wifiManager = reactApplicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
                val wifiInfo = wifiManager.connectionInfo
                macAddress = wifiInfo.macAddress
            }
            
            if (macAddress == null || macAddress == "02:00:00:00:00:00" || macAddress.isEmpty()) {
                // Try another approach
                macAddress = getMacAddressFromNetworkInterface()
            }
            
            promise.resolve(macAddress)
        } catch (e: Exception) {
            promise.reject("MAC_ADDRESS_ERROR", e.message, e)
        }
    }
    
    private fun getMacAddressFromNetworkInterface(): String {
        try {
            val networkInterfaces = Collections.list(NetworkInterface.getNetworkInterfaces())
            for (networkInterface in networkInterfaces) {
                if (networkInterface.name.equals("wlan0", ignoreCase = true)) {
                    val macBytes = networkInterface.hardwareAddress
                    if (macBytes == null) {
                        return ""
                    }
                    
                    val macAddressBuilder = StringBuilder()
                    for (i in macBytes.indices) {
                        macAddressBuilder.append(String.format("%02X:", macBytes[i]))
                    }
                    
                    if (macAddressBuilder.isNotEmpty()) {
                        macAddressBuilder.deleteCharAt(macAddressBuilder.length - 1)
                    }
                    
                    return macAddressBuilder.toString()
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        
        return ""
    }
} 