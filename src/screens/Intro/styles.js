import { StyleSheet } from 'react-native';

import COLORS from '../../styles/colors';
import {
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  topWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: normalize(90),
    marginTop: normalize(18),
    justifyContent: 'space-between',
  },
  introImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  bottomWrapper: {
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  buttonWrapper: {
    justifyContent: 'center',
    height: normalizeHeight(180),
    paddingHorizontal: normalize(30),
    backgroundColor: COLORS.secondary,
  },
  joinButton: {
    opacity: 0.4,
    alignItems: 'center',
    borderRadius: normalize(12),
    paddingVertical: normalize(12),
    backgroundColor: COLORS.primary,
  },
  joinText: {
    fontWeight: '600',
    color: COLORS.secondary,
    fontSize: normalizeFont(18),
  },
  guestButton: {
    alignItems: 'center',
    marginTop: normalize(16),
    borderRadius: normalize(12),
    paddingVertical: normalize(12),
    backgroundColor: COLORS.primary,
  },
  guestText: {
    fontWeight: '600',
    color: COLORS.secondary,
    fontSize: normalizeFont(18),
  },
});

export default styles;
