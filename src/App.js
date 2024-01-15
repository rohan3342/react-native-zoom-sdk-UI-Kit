import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';

import { CameraOff } from './assets/SVG';
import ZOOM_APP_CONFIG from './utils/constant';
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default function App() {
  return (
    <View style={styles.container}>
      <ZoomVideoSdkProvider config={ZOOM_APP_CONFIG}>
        <CameraOff />
      </ZoomVideoSdkProvider>
    </View>
  );
}
