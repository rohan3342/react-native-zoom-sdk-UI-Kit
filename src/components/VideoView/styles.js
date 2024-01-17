import { StyleSheet } from 'react-native';

import {
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';
import Colors from '../../styles/colors';

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallView: {
    overflow: 'hidden',
    alignItems: 'center',
    width: normalize(100),
    height: normalize(100),
    justifyContent: 'center',
    borderColor: Colors.grey,
    borderWidth: normalize(1),
    borderRadius: normalize(8),
    marginHorizontal: normalize(4),
    backgroundColor: Colors.dark_grey,
  },
  zoomView: {
    width: '100%',
    height: '100%',
  },
  focusedBorder: {
    borderColor: Colors.success,
  },
  avatarLarge: {
    width: normalize(200),
    height: normalize(200),
  },
  avatarSmall: {
    width: normalize(60),
    height: normalize(60),
  },
  userInfo: {
    left: 0,
    bottom: 0,
    width: '100%',
    position: 'absolute',
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(8),
    backgroundColor: Colors.black060,
    paddingVertical: normalizeHeight(2),
    borderBottomLeftRadius: normalize(8),
    borderBottomRightRadius: normalize(8),
  },
  userName: {
    color: Colors.secondary,
    fontSize: normalizeFont(12),
  },
  audioStatusIcon: {
    width: normalize(12),
    height: normalize(12),
  },
});

export default styles;
