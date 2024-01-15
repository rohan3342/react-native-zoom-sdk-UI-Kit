import { StyleSheet } from 'react-native';

import Colors from '../../styles/colors';
import {
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: normalize(100),
    justifyContent: 'center',
    height: normalizeHeight(40),
    borderRadius: normalize(12),
    backgroundColor: Colors.secondary,
  },
  title: {
    color: Colors.tertiary,
    fontSize: normalizeFont(12),
  },
});

export default styles;
