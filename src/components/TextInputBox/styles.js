import { StyleSheet } from 'react-native';

import Colors from '../../styles/colors';
import {
  normalize,
  SCREEN_WIDTH,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    height: normalizeHeight(50),
    borderTopWidth: normalize(1),
    borderBottomWidth: normalize(1),
    borderTopColor: Colors.off_white,
    backgroundColor: Colors.secondary,
    borderBottomColor: Colors.off_white,
  },
  textInput: (textColor = Colors.secondary) => ({
    flex: 1,
    color: textColor,
    paddingVertical: 0,
    fontSize: normalizeFont(14),
  }),
});

export default styles;
