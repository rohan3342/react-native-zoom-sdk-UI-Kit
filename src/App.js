import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';

import { Navigation } from './navigation';
import ZOOM_APP_CONFIG from './utils/constant';

export default function App() {
  return (
    <NavigationContainer>
      <ZoomVideoSdkProvider config={ZOOM_APP_CONFIG}>
        <Navigation />
      </ZoomVideoSdkProvider>
    </NavigationContainer>
  );
}
