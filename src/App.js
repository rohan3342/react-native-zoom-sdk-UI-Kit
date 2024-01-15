import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
import { NavigationContainer } from '@react-navigation/native';
import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';

import { Navigation } from './navigation';
import ZOOM_APP_CONFIG from './utils/constant';
import COLORS from './styles/colors';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      ImmersiveMode.setBarStyle('Light');
      ImmersiveMode.setBarColor(COLORS.primary);
    } else {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(COLORS.primary);
    }
  }, []);

  return (
    <NavigationContainer>
      <ZoomVideoSdkProvider config={ZOOM_APP_CONFIG}>
        <Navigation />
      </ZoomVideoSdkProvider>
    </NavigationContainer>
  );
}
