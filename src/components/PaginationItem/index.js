import React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View } from 'react-native';

import styles from './styles';

const PaginationItem = (props) => {
  const { activeDot, index, length, width } = props;
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && activeDot?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            activeDot?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [activeDot, index, length]);

  return (
    <View style={styles.dotStyle(width)}>
      <Animated.View style={[styles.animatedDotStyle, animStyle]} />
    </View>
  );
};

export default PaginationItem;
