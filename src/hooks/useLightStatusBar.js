import { useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import ImmersiveMode from 'react-native-immersive-mode';
import { useFocusEffect } from '@react-navigation/native';

import Colors from '../styles/colors';

export default function useLightStatusBar(darkTheme, color = Colors.secondary) {
  useFocusEffect(
    useCallback(() => {
      // timeout added to handle cases where next screen also has a light status bar
      const timeoutId = setTimeout(() => {
        if (Platform.OS === 'android') {
          ImmersiveMode.setBarColor(color);
          ImmersiveMode.setBarStyle(!darkTheme ? 'Light' : 'Dark');
        } else {
          StatusBar.setBarStyle(!darkTheme ? 'light-content' : 'dark-content');
        }
      });
      return () => {
        clearTimeout(timeoutId);
        if (Platform.OS === 'android') {
          ImmersiveMode.setBarColor(color);
          ImmersiveMode.setBarStyle(!darkTheme ? 'Light' : 'Dark');
        } else {
          StatusBar.setBarStyle(!darkTheme ? 'light-content' : 'dark-content');
        }
      };
    }, [])
  );
}
