import { Animated, Easing } from 'react-native';
import React, { useRef, useEffect } from 'react';

import Colors from '../../styles/colors';
import { Loader } from '../../assets/SVG';

export default function LoaderComp(props) {
  const {
    size = 20,
    speed = 1,
    style = {},
    animating = true,
    color = Colors?.tertiary,
  } = props;

  const loaderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(loaderAnim, {
        toValue: 1,
        duration: 1000 / speed,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          display: animating ? 'flex' : 'none',
          alignSelf: 'center',
          transform: [
            {
              rotate: loaderAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <Loader width={size} height={size} fill={color} />
    </Animated.View>
  );
}
