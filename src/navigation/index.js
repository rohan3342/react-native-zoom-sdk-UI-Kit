import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CallScreen from '../screens/Call';
import HomeScreen from '../screens/Home';
import JoinScreen from '../screens/Join';
import IntroScreen from '../screens/Intro';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  gestureEnabled: false,
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};

export function Navigation() {
  return (
    <Stack.Navigator
      mode='modal'
      initialRouteName='Intro'
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name='Intro'
        component={IntroScreen}
        options={{ gestureEnabled: true, presentation: 'card' }}
      />
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen name='Join' component={JoinScreen} />
      <Stack.Screen
        name='Call'
        component={CallScreen}
        options={{ gestureEnabled: true, presentation: 'card' }}
      />
    </Stack.Navigator>
  );
}
