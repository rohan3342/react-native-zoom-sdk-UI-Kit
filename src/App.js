import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
import { NavigationContainer } from '@react-navigation/native';
import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';

import Colors from './styles/colors';
import Prompt from './components/Prompt';
import { Navigation } from './navigation';
import ZOOM_APP_CONFIG from './utils/constant';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      ImmersiveMode.setBarStyle('Light');
      ImmersiveMode.setBarColor(Colors.primary);
    } else {
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  return (
    <NavigationContainer>
      <ZoomVideoSdkProvider config={ZOOM_APP_CONFIG}>
        <Prompt />
        <Navigation />
      </ZoomVideoSdkProvider>
    </NavigationContainer>
  );
}
