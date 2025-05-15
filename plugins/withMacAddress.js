const { withAndroidManifest } = require('@expo/config-plugins');

function addMacAddressPermissions(androidManifest) {
  const { manifest } = androidManifest;
  
  if (!Array.isArray(manifest['uses-permission'])) {
    manifest['uses-permission'] = [];
  }
  
  // Add required permissions
  const permissions = [
    'android.permission.ACCESS_WIFI_STATE',
    'android.permission.ACCESS_NETWORK_STATE',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.ACCESS_COARSE_LOCATION'
  ];
  
  permissions.forEach(permission => {
    const exists = manifest['uses-permission'].some(item => 
      item.$['android:name'] === permission
    );
    
    if (!exists) {
      manifest['uses-permission'].push({
        $: {
          'android:name': permission
        }
      });
    }
  });
  
  return androidManifest;
}

module.exports = function withMacAddress(config) {
  return withAndroidManifest(config, config => {
    config.modResults = addMacAddressPermissions(config.modResults);
    return config;
  });
}; 