import { NativeModules, Platform } from 'react-native';

// We create a mock implementation since we can't use the real native module
const mockMacAddressForTesting = () => {
  // Generate a random MAC-like address for testing purposes
  const hexDigits = "0123456789ABCDEF";
  let macAddress = "";
  
  for (let i = 0; i < 6; i++) {
    if (i > 0) macAddress += ":";
    macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
    macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
  }
  
  return macAddress;
};

// Use this mock module when the native module isn't available
export default {
  getMacAddress: () => {
    try {
      if (Platform.OS === 'android' && NativeModules.MacAddressModule) {
        return NativeModules.MacAddressModule.getMacAddress();
      }
    } catch (e) {
      console.log('Using mock MAC address module', e);
    }
    
    // Return a mock implementation for testing
    return Promise.resolve(mockMacAddressForTesting());
  }
}; 