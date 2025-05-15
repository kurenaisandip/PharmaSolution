const { withPlugins, withAndroidManifest } = require('expo/config-plugins');

module.exports = ({ config }) => {
  config = {
    ...config,
    name: "PharmaSolution",
    slug: "PharmaSolution",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pharmasolution",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.pharmasolution.app",
      permissions: [
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  };

  return withPlugins(config, [
    // Add custom plugins to modify native code
    [withAndroidManifestPermissions, {
      permissions: [
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    }]
  ]);
};

// Custom plugin to add permissions
function withAndroidManifestPermissions(config, { permissions }) {
  return withAndroidManifest(config, config => {
    const { manifest } = config.modResults;
    
    if (!Array.isArray(manifest['uses-permission'])) {
      manifest['uses-permission'] = [];
    }
    
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
    
    return config;
  });
} 