import { StyleSheet } from 'react-native';

import Colors from '../../styles/colors';
import { normalize } from '../../styles/responsive';

const styles = StyleSheet.create({
  dotStyle: (width) => ({
    width,
    height: width,
    overflow: 'hidden',
    borderRadius: normalize(50),
    backgroundColor: Colors.secondary,
  }),
  animatedDotStyle: {
    flex: 1,
    borderRadius: normalize(50),
    backgroundColor: Colors.tertiary,
  },
});

export default styles;
