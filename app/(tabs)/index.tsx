import * as Device from 'expo-device';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, Button, Linking, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [deviceInfo, setDeviceInfo] = useState('');
  const [deviceId, setDeviceId] = useState('');

  // Get device information using only expo-device
  async function getDeviceInfo() {
    try {
      // Collect various device information using expo-device
      const modelName = Device.modelName || 'Unknown model';
      const deviceType = Device.deviceType === Device.DeviceType.PHONE ? 'Phone' : 
                      Device.deviceType === Device.DeviceType.TABLET ? 'Tablet' : 'Unknown';
      const osName = Device.osName || 'Unknown OS';
      const osVersion = Device.osVersion || 'Unknown version';
      
      // Get device identifier
      let uuid = '';
      try {
        // Try to get device ID - use a property that's available
        uuid = Device.osBuildId || Device.osInternalBuildId || Device.deviceName || '';
        setDeviceId(uuid);
        console.log('Device ID:', uuid);
      } catch (e) {
        console.log('Error getting device ID:', e);
      }
      
      // Method 2: Open Android Settings to view Wi-Fi info which includes MAC address
      Alert.alert('Device Info', 
        'For security reasons, direct access to MAC address is restricted in newer Android/iOS versions.\n\n' +
        'Do you want to open Device Settings where you can manually view your MAC address?',
        [
          {
            text: 'No',
            style: 'cancel'
          },
          {
            text: 'Yes, Open Settings',
            onPress: () => {
              Linking.openSettings();
            }
          }
        ]
      );
      
      // Display all the collected info
      const info = `Device ID: ${uuid || 'Not directly accessible'}
Device Type: ${deviceType}
Model: ${modelName}
OS: ${osName} ${osVersion}

Note: For privacy/security reasons, MAC addresses 
cannot be directly accessed programmatically.
You can view your MAC address in device settings.`;
      
      setDeviceInfo(info);
    } catch (error) {
      setDeviceInfo('Error fetching device info: ' + (error instanceof Error ? error.message : String(error)));
      console.error(error);
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Pharma Solutions</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <Button
        onPress={getDeviceInfo}
        title="Get Device Info"
        color="#841584"
        accessibilityLabel="Get device information"
      />

      {deviceInfo ? (
        <ThemedView style={styles.infoContainer}>
          <ThemedText type="subtitle">Device Information:</ThemedText>
          <ThemedText selectable={true}>{deviceInfo}</ThemedText>
        </ThemedView>
      ) : null}

      {deviceId ? (
        <ThemedView style={styles.macContainer}>
          <ThemedText type="subtitle">Device ID:</ThemedText>
          <ThemedText selectable={true} style={styles.macText}>{deviceId}</ThemedText>
        </ThemedView>
      ) : null}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  macContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 2,
    borderColor: '#841584',
    borderRadius: 5,
    backgroundColor: 'rgba(132, 21, 132, 0.1)',
    alignItems: 'center',
  },
  macText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
